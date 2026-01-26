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

export interface IntegrationService {
  id: string;
  name: string;
  description: string;
  icon: string;
  href: string;
  status: "connected" | "disconnected" | "error";
}
