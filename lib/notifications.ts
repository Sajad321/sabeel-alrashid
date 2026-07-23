export interface NotificationMessage {
  type: "contact" | "franchise" | "job";
  submissionId: string;
  subject: string;
  summary: string;
  recipient: string;
}
export interface NotificationTransport {
  send(message: NotificationMessage): Promise<{ id: string }>;
}
export const notificationTransport: NotificationTransport | null = null;
