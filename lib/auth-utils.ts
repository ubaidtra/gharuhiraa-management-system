import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getSessionUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

export function getTeacherId(session: { user?: { role?: string; teacherId?: string | null } } | null): string | null {
  if (!session?.user) return null;
  if (session.user.role !== "TEACHER") return null;
  return session.user.teacherId ?? null;
}
