import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isRedirectError } from "@/lib/utils/errors";

export default async function Home() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.role) {
      redirect("/login");
    }

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
  } catch (error: unknown) {
    if (isRedirectError(error)) {
      throw error;
    }
    
    const errorMessage = error instanceof Error ? error.message : String(error || "Unknown error");
    console.error("Error in home page:", errorMessage);
    redirect("/login");
  }
  
  return null;
}

