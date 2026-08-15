import { NotificationRepository, HomeworkRecord } from "./notificationRepository";

export interface NotificationResult {
  success: boolean;
  messageId?: string;
  whatsappMessageUrl?: string;
  whatsappMessageText?: string;
  error?: string;
}

export class WhatsAppNotificationService {
  private repository: NotificationRepository;

  constructor() {
    this.repository = new NotificationRepository();
  }

  /**
   * Process and generate WhatsApp Notification for Guardian
   */
  public async sendHomeworkGradedNotification(
    payload: HomeworkRecord,
    requesterParentId: string = "parent-8824"
  ): Promise<NotificationResult> {
    try {
      // 🚨 SECURITY CHECK: Ensure homework.student_id belongs to guardian.parent_id
      const isAuthorized = await this.repository.verifyGuardianOwnership(
        payload.student_id,
        requesterParentId
      );

      if (!isAuthorized) {
        throw new Error("SECURITY_ERROR: Unauthorized access to student results.");
      }

      // Format WhatsApp Notification Message as required by task
      const whatsappMessageText =
        `প্রিয় অভিভাবক,\n\n` +
        `আপনার সন্তানের হোমওয়ার্ক মূল্যায়ন সম্পন্ন হয়েছে।\n\n` +
        `Student:\n${payload.student_name}\n\n` +
        `Lesson:\n${payload.lesson_name}\n\n` +
        `Marks:\n${payload.marks}\n\n` +
        `Grade:\n${payload.grade}\n\n` +
        `Teacher Remarks:\n${payload.teacher_remarks}\n\n` +
        `সম্পূর্ণ রিপোর্ট দেখতে:\n` +
        `http://localhost:5174/guardian\n\n` +
        `ধন্যবাদ।`;

      const targetPhone = payload.guardian_phone || "+8801700000000";
      const whatsappMessageUrl = `https://api.whatsapp.com/send?phone=${targetPhone.replace(
        /[^0-9]/g,
        ""
      )}&text=${encodeURIComponent(whatsappMessageText)}`;

      // Simulate WhatsApp Gateway dispatch
      console.log("[WhatsApp Gateway Service] Dispatched Guardian Notification:", {
        to: targetPhone,
        message: whatsappMessageText,
      });

      return {
        success: true,
        messageId: `msg-${Date.now()}`,
        whatsappMessageUrl,
        whatsappMessageText,
      };
    } catch (err: any) {
      console.error("[WhatsApp Notification Service Error]:", err.message);
      return {
        success: false,
        error: err.message,
      };
    }
  }
}
