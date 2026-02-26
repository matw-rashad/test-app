export interface MailSettings {
  userName: string;
  password: string;
  smtpServer: string;
  smtpPort: string;
  senderName: string;
  senderEmail: string;
}

export interface UniteCredentials {
  username: string;
  password: string;
  ftpUrl: string;
  orderResponseUrl: string;
  dispatchNotificationUrl: string;
  invoiceUrl: string;
  importLocation: string;
  contactPersonCode: string;
}

export interface AmazonCredentials {
  // Zubehor account
  amazonClientId_Zubehor: string;
  amazonClientSecret_Zubehor: string;
  amazonRefreshToken_Zubehor: string;
  // UAG account
  amazonClientId_UAG: string;
  amazonClientSecret_UAG: string;
  amazonRefreshToken_UAG: string;
  // Vendor account
  amazonClientId_Vendor: string;
  amazonClientSecret_Vendor: string;
  amazonRefreshToken_Vendor: string;
  // Amazon Ads
  amazonAdsClientId: string;
  amazonAdsClientSecret: string;
  amazonAdsRefreshToken: string;
  amazonAdsTokenUrl: string;
  amazonAdsApiUrl: string;
  // Common
  amazonEndpoint: string;
  amazonReturnsCsvLocation: string;
  amazonAdsReportStartDays: number;
}

export interface SellerLogicCredentials {
  sl_ClientId: string;
  sl_SecretKey: string;
}

export interface DhlCredentials {
  clientKey: string;
  clientSecret: string;
}

export interface ITScopeCredentials {
  accountId: string;
  apiKey: string;
}

export interface ConradSettings {
  importLocation: string;
  exportLocation: string;
}

export interface DigitecSettings {
  productUpdateLocation: string;
  importLocation: string;
  exportLocation: string;
}

export interface SapSettings {
  serviceLayerBaseUrl: string;
  companyDb: string;
  userName: string;
  userPassword: string;
}

export interface SqlSettings {
  connectionString: string;
}

export interface MiddlewareSettings {
  archiveLocation: string;
}

export interface IntegrationService {
  id: string;
  name: string;
  description: string;
  icon: string;
  href: string;
  status: "connected" | "disconnected" | "error";
}

// Quartz Job Types
export interface RunningJob {
  jobName: string;
  jobGroup: string;
  triggerName: string;
  fireTime: string;
  runTime: string;
}

export interface ScheduledJob {
  jobName: string;
  jobGroup: string;
  nextFireTime: string | null;
  state: "Normal" | "Paused" | "Complete" | "Error" | "Blocked" | "None";
}

export interface UpcomingJob {
  jobName: string;
  jobGroup: string;
  triggerName: string;
  description: string | null;
  nextFireTime: string;
  nextFireTimeUtc: string;
  previousFireTime: string | null;
  timeUntilFire: string;
  timeUntilFireFormatted: string;
  cronExpression: string | null;
  state: string;
  priority: number;
}

export interface UpcomingJobsResponse {
  jobs: UpcomingJob[];
  totalCount: number;
  hoursAhead: number;
  generatedAt: string;
}
