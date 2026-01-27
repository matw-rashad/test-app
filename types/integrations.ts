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
