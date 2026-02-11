import { supabase } from "./supabase";

export async function generateStudentId(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `STU-${year}-`;
  const startOfYear = `${year}-01-01`;

  const { count } = await supabase
    .from("Student")
    .select("*", { count: "exact", head: true })
    .gte("registrationDate", startOfYear);

  const nextNum = (count ?? 0) + 1;
  const studentId = `${prefix}${nextNum.toString().padStart(4, "0")}`;

  const { data: existing } = await supabase
    .from("Student")
    .select("id")
    .eq("studentId", studentId)
    .maybeSingle();

  if (existing) {
    return `${prefix}${(nextNum + 1).toString().padStart(4, "0")}`;
  }
  return studentId;
}

export async function generateTeacherId(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `TCH-${year}-`;
  const startOfYear = `${year}-01-01`;

  const { count } = await supabase
    .from("Teacher")
    .select("*", { count: "exact", head: true })
    .gte("hireDate", startOfYear);

  const nextNum = (count ?? 0) + 1;
  const teacherId = `${prefix}${nextNum.toString().padStart(3, "0")}`;

  const { data: existing } = await supabase
    .from("Teacher")
    .select("id")
    .eq("teacherId", teacherId)
    .maybeSingle();

  if (existing) {
    return `${prefix}${(nextNum + 1).toString().padStart(3, "0")}`;
  }
  return teacherId;
}

export function isValidStudentId(id: string): boolean {
  return /^STU-\d{4}-\d{4}$/.test(id);
}

export function isValidTeacherId(id: string): boolean {
  return /^TCH-\d{4}-\d{3}$/.test(id);
}
