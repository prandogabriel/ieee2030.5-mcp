// IEEE 2030.5 Standard Types and Interfaces

export interface DeviceCapability {
  '@': {
    xmlns: string;
    href: string;
    pollRate?: string;
  };
  DemandResponseProgramListLink?: LinkElement;
  DERProgramListLink?: LinkElement;
  ResponseSetListLink?: LinkElement;
  TimeLink?: LinkElement;
  UsagePointListLink?: LinkElement;
  EndDeviceListLink?: LinkElement;
  MirrorUsagePointListLink?: LinkElement;
  SelfDeviceLink?: LinkElement;
}

export interface LinkElement {
  '@': {
    href: string;
    all?: string;
  };
}

export interface Time {
  currentTime: number;
  dstEndTime?: number;
  dstOffset?: number;
  dstStartTime?: number;
  localTime?: number;
  quality?: number;
}

export interface EndDevice {
  '@': {
    href: string;
  };
  changedTime?: number;
  enabled?: boolean;
  sFDI: number; // Short Form Device Identifier
  loadShedDeviceCategory?: number;
  DERListLink?: LinkElement;
  DeviceInformationLink?: LinkElement;
  DeviceStatusLink?: LinkElement;
  FileStatusLink?: LinkElement;
  IPInterfaceListLink?: LinkElement;
  LoadShedAvailabilityLink?: LinkElement;
  LogEventListLink?: LinkElement;
  PowerStatusLink?: LinkElement;
  SubscriptionLink?: LinkElement;
}

export interface DERProgram {
  '@': {
    href: string;
  };
  mRID: string;
  description?: string;
  version?: number;
  DERControlListLink?: LinkElement;
  DERCurveListLink?: LinkElement;
  primacy?: number;
}

export interface UsagePoint {
  '@': {
    href: string;
  };
  mRID: string;
  description?: string;
  roleFlags?: string;
  serviceCategoryKind?: number;
  status?: number;
  MeterReadingListLink?: LinkElement;
}

// Response wrapper types
export interface IEEE2030ListResponse<T> {
  '@': {
    href: string;
    all?: string;
    results?: string;
  };
  List?: T[];
}

// Error types
export interface IEEE2030Error {
  code: number;
  message: string;
  details?: string;
}

// Client configuration
export interface IEEE2030ClientConfig {
  baseUrl: string;
  certPath?: string;
  certValue?: string;
  keyPath?: string;
  keyValue?: string;
  caPath?: string;
  caValue?: string;
  insecure?: boolean;
  timeout?: number;
  userAgent?: string;
}

// Common response format
export interface IEEE2030Response<T = any> {
  data: T;
  status: number;
  headers: Record<string, string>;
  requestId?: string;
}
