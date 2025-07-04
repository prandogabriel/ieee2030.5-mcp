import type { IEEE2030ClientConfig } from './ieee2030-5-types.js';

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

export class ConfigService {
  static getIEEE2030Config(): IEEE2030ClientConfig {
    const baseUrl = process.env.IEEE2030_BASE_URL;
    if (!baseUrl) {
      throw new ConfigError('IEEE2030_BASE_URL environment variable is required');
    }

    const certPath = process.env.IEEE2030_CERT_PATH;
    const certValue = process.env.IEEE2030_CERT_VALUE;
    const keyPath = process.env.IEEE2030_KEY_PATH;
    const keyValue = process.env.IEEE2030_KEY_VALUE;
    const caPath = process.env.IEEE2030_CA_PATH;
    const caValue = process.env.IEEE2030_CA_VALUE;

    if (!certPath && !certValue) {
      throw new ConfigError(
        'Either IEEE2030_CERT_PATH or IEEE2030_CERT_VALUE environment variable is required'
      );
    }

    // If using certPath and no separate key is provided, assume the cert file contains both cert and key
    // This is common with .pem files that include both certificate and private key

    const config: IEEE2030ClientConfig = {
      baseUrl: baseUrl.replace(/\/$/, ''), // Remove trailing slash
      certPath,
      certValue,
      keyPath,
      keyValue,
      caPath,
      caValue,
      insecure: process.env.IEEE2030_INSECURE === 'true',
      timeout: process.env.IEEE2030_TIMEOUT
        ? Number.parseInt(process.env.IEEE2030_TIMEOUT, 10)
        : 30000,
      userAgent: process.env.IEEE2030_USER_AGENT || 'ieee2030.5-mcp/0.0.0',
    };

    return config;
  }

  static validateConfig(config: IEEE2030ClientConfig): void {
    if (!config.baseUrl) {
      throw new ConfigError('baseUrl is required');
    }

    try {
      new URL(config.baseUrl);
    } catch {
      throw new ConfigError('baseUrl must be a valid URL');
    }

    if (!config.certPath && !config.certValue) {
      throw new ConfigError('Either certPath or certValue is required');
    }

    if (config.timeout && (config.timeout < 1000 || config.timeout > 300000)) {
      throw new ConfigError('timeout must be between 1000 and 300000 milliseconds');
    }
  }

  static getRequiredEnvVar(name: string): string {
    const value = process.env[name];
    if (!value) {
      throw new ConfigError(`${name} environment variable is required`);
    }
    return value;
  }

  static getOptionalEnvVar(name: string, defaultValue?: string): string | undefined {
    return process.env[name] || defaultValue;
  }

  static getBooleanEnvVar(name: string, defaultValue = false): boolean {
    const value = process.env[name];
    if (!value) return defaultValue;
    return value.toLowerCase() === 'true';
  }

  static getNumberEnvVar(name: string, defaultValue?: number): number | undefined {
    const value = process.env[name];
    if (!value) return defaultValue;
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      throw new ConfigError(`${name} must be a valid number`);
    }
    return parsed;
  }
}
