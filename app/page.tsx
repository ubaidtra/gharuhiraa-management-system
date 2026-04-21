import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isRedirectError } from "@/lib/utils/errors";

export const dynamic = "force-dynamic";

export default async function Home() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role) redirect("/login");

    switch (session.user.role) {
      case "ACCOUNTS":
        redirect("/accounts");
      case "TEACHER":
        redirect("/teachers");
      case "MANAGEMENT":
        redirect("/management");
      default:
        redirect("/login");
    }
  } catch (e) {
    if (isRedirectError(e)) throw e;
    console.error("Home redirect error:", e);
    redirect("/login");
  }
  return null;
}
