import { WhatsAppNotificationService, NotificationResult } from "./whatsappNotificationService";
import { HomeworkRecord } from "./notificationRepository";

export class WhatsAppNotificationController {
  private service: WhatsAppNotificationService;

  constructor() {
    this.service = new WhatsAppNotificationService();
  }

  /**
   * Express Controller endpoint / post-save hook handler
   */
  public async handleHomeworkGraded(
    req: { body: HomeworkRecord; parentId?: string }
  ): Promise<{ statusCode: number; body: NotificationResult }> {
    try {
      const { body, parentId } = req;

      // Validate required fields
      if (!body.homework_id || !body.student_id || body.marks === undefined) {
        return {
          statusCode: 400,
          body: {
            success: false,
            error: "BAD_REQUEST: Missing required homework parameters.",
          },
        };
      }

      // Delegate to service layer
      const result = await this.service.sendHomeworkGradedNotification(
        body,
        parentId || "parent-8824"
      );

      const statusCode = result.success ? 200 : 403;
      return { statusCode, body: result };
    } catch (error: any) {
      return {
        statusCode: 500,
        body: {
          success: false,
          error: error.message || "INTERNAL_SERVER_ERROR",
        },
      };
    }
  }
}

// Export singleton controller instance for backend hooks
export const whatsappNotificationController = new WhatsAppNotificationController();
