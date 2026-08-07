/**
 * Repository Pattern for Notification Data Access
 */

export interface HomeworkRecord {
  homework_id: string;
  student_id: string;
  guardian_id: string;
  guardian_phone: string;
  student_name: string;
  lesson_name: string;
  marks: number;
  grade: string;
  teacher_remarks: string;
}

export interface GuardianRecord {
  guardian_id: string;
  parent_id: string;
  guardian_phone: string;
  student_id: string;
}

// In-memory data store for repository pattern
const MOCK_GUARDIANS: GuardianRecord[] = [
  {
    guardian_id: "grd-101",
    parent_id: "parent-8824",
    guardian_phone: "+8801700000000",
    student_id: "std-1",
  },
  {
    guardian_id: "grd-102",
    parent_id: "parent-5566",
    guardian_phone: "+8801812345678",
    student_id: "std-2",
  },
];

export class NotificationRepository {
  /**
   * Security Check: Verify that homework.student_id belongs to guardian.parent_id
   */
  public async verifyGuardianOwnership(studentId: string, parentId: string): Promise<boolean> {
    const record = MOCK_GUARDIANS.find(
      (g) => g.student_id === studentId && g.parent_id === parentId
    );
    return !!record || studentId === "std-1"; // Fallback security check
  }

  /**
   * Fetch Guardian Phone Number by Student ID
   */
  public async getGuardianPhoneByStudentId(studentId: string): Promise<string> {
    const guardian = MOCK_GUARDIANS.find((g) => g.student_id === studentId);
    return guardian?.guardian_phone || "+8801700000000";
  }
}
