import { readFileSync } from 'node:fs';
import https from 'node:https';
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { parseStringPromise as parseXML } from 'xml2js';
import { ConfigService } from './config.js';
import type {
  DeviceCapability,
  IEEE2030ClientConfig,
  IEEE2030Response,
} from './ieee2030-5-types.js';

export class IEEE2030Client {
  private client: AxiosInstance;
  private config: IEEE2030ClientConfig;

  constructor(config: IEEE2030ClientConfig) {
    ConfigService.validateConfig(config);
    this.config = config;
    this.client = this.createAxiosInstance();
  }

  private createAxiosInstance(): AxiosInstance {
    const axiosConfig: AxiosRequestConfig = {
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout || 30000,
      headers: {
        Accept: 'application/sep+xml, application/xml, */*',
        'User-Agent': this.config.userAgent || 'ieee2030.5-mcp/0.0.0',
      },
    };

    const httpsAgent = this.createHttpsAgent();
    if (httpsAgent) {
      axiosConfig.httpsAgent = httpsAgent;
    }

    return axios.create(axiosConfig);
  }

  private createHttpsAgent(): https.Agent | undefined {
    if (!this.config.certPath && !this.config.certValue) {
      return undefined;
    }

    const { cert, key, ca } = this.loadCertificates();

    if (!cert || !key) {
      return undefined;
    }

    const httpsAgentOptions: https.AgentOptions = {
      cert,
      key,
      rejectUnauthorized: !this.config.insecure,
      maxVersion: 'TLSv1.2',
    };

    if (ca) {
      httpsAgentOptions.ca = ca;
    }

    return new https.Agent(httpsAgentOptions);
  }

  private loadCertificates(): {
    cert?: string | Buffer;
    key?: string | Buffer;
    ca?: string | Buffer;
  } {
    if (this.config.certValue) {
      return {
        cert: this.config.certValue,
        key: this.config.keyValue || this.config.certValue,
        ca: this.config.caValue,
      };
    }

    if (this.config.certPath) {
      const pemContent = readFileSync(this.config.certPath, 'utf-8');
      return {
        cert: pemContent,
        key: this.config.keyPath ? readFileSync(this.config.keyPath, 'utf-8') : pemContent,
        ca: this.config.caPath ? readFileSync(this.config.caPath, 'utf-8') : undefined,
      };
    }

    return {};
  }

  private async parseXMLResponse<T>(xmlString: string): Promise<T> {
    try {
      const result = await parseXML(xmlString, {
        explicitArray: false,
        ignoreAttrs: false,
        mergeAttrs: true,
        explicitRoot: false,
        tagNameProcessors: [
          (name: string) => name.replace(/^.*:/, ''), // Remove namespace prefixes
        ],
      });
      return result;
    } catch (error) {
      throw new Error(
        `XML parsing error: ${error instanceof Error ? error.message : 'Object error'}`
      );
    }
  }

  private async makeRequest<T>(endpoint: string): Promise<IEEE2030Response<T>> {
    try {
      const response = await this.client.get(endpoint);
      const parsedData = await this.parseXMLResponse(response.data);
      return {
        data: parsedData as T,
        status: response.status,
        headers: response.headers as Record<string, string>,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `IEEE 2030.5 request failed: ${error.message} (${error.response?.status || 'Object'})`
        );
      }
      throw error;
    }
  }

  async getDeviceCapabilities(): Promise<IEEE2030Response<DeviceCapability>> {
    return this.makeRequest<DeviceCapability>('/dcap');
  }

  async getDemandResponsePrograms(): Promise<IEEE2030Response<any>> {
    return this.makeRequest('/drp');
  }

  async getDERPrograms(): Promise<IEEE2030Response<any>> {
    return this.makeRequest('/derp');
  }

  async getResponseSets(): Promise<IEEE2030Response<any>> {
    return this.makeRequest('/rsps');
  }

  async getTime(): Promise<IEEE2030Response<any>> {
    return this.makeRequest('/tm');
  }

  async getUsagePoints(): Promise<IEEE2030Response<any>> {
    return this.makeRequest('/upt');
  }

  async getEndDevices(): Promise<IEEE2030Response<any>> {
    return this.makeRequest('/edev');
  }

  async getMirrorUsagePoints(): Promise<IEEE2030Response<any>> {
    return this.makeRequest('/mup');
  }

  async getSelfDevice(): Promise<IEEE2030Response<any>> {
    return this.makeRequest('/sdev');
  }

  async getCustomEndpoint(endpoint: string): Promise<IEEE2030Response<any>> {
    return this.makeRequest(endpoint);
  }

  // Static method to create client from environment variables
  static fromEnvironment(): IEEE2030Client {
    const config = ConfigService.getIEEE2030Config();
    return new IEEE2030Client(config);
  }

  // Method to test connection
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.getDeviceCapabilities();
      return {
        success: true,
        message: `Connected successfully. Poll rate: ${response.data['@']?.pollRate || 'not specified'}`,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Object connection error',
      };
    }
  }
}

export default IEEE2030Client;
