/**
 * ID Generator Utility
 * Generates unique identification numbers for students and teachers
 */

import { prisma } from "./prisma";

/**
 * Generate a unique student ID
 * Format: STU-YYYY-NNNN (e.g., STU-2025-0001)
 */
export async function generateStudentId(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = `STU-${currentYear}-`;

  // Get the count of students created this year
  const startOfYear = new Date(currentYear, 0, 1);
  const studentsThisYear = await prisma.student.count({
    where: {
      registrationDate: {
        gte: startOfYear,
      },
    },
  });

  // Generate next number (increment by 1)
  const nextNumber = studentsThisYear + 1;
  const paddedNumber = nextNumber.toString().padStart(4, "0");

  const studentId = `${prefix}${paddedNumber}`;

  // Check if ID already exists (edge case)
  const existing = await prisma.student.findFirst({
    where: { studentId },
  });

  if (existing) {
    // If exists, try next number
    const nextPaddedNumber = (nextNumber + 1).toString().padStart(4, "0");
    return `${prefix}${nextPaddedNumber}`;
  }

  return studentId;
}

/**
 * Generate a unique teacher ID
 * Format: TCH-YYYY-NNN (e.g., TCH-2025-001)
 */
export async function generateTeacherId(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = `TCH-${currentYear}-`;

  // Get the count of teachers created this year
  const startOfYear = new Date(currentYear, 0, 1);
  const teachersThisYear = await prisma.teacher.count({
    where: {
      hireDate: {
        gte: startOfYear,
      },
    },
  });

  // Generate next number (increment by 1)
  const nextNumber = teachersThisYear + 1;
  const paddedNumber = nextNumber.toString().padStart(3, "0");

  const teacherId = `${prefix}${paddedNumber}`;

  // Check if ID already exists (edge case)
  const existing = await prisma.teacher.findFirst({
    where: { teacherId },
  });

  if (existing) {
    // If exists, try next number
    const nextPaddedNumber = (nextNumber + 1).toString().padStart(3, "0");
    return `${prefix}${nextPaddedNumber}`;
  }

  return teacherId;
}

/**
 * Validate student ID format
 */
export function isValidStudentId(id: string): boolean {
  const pattern = /^STU-\d{4}-\d{4}$/;
  return pattern.test(id);
}

/**
 * Validate teacher ID format
 */
export function isValidTeacherId(id: string): boolean {
  const pattern = /^TCH-\d{4}-\d{3}$/;
  return pattern.test(id);
}

