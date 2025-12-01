import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Redirect based on role
  if (session.user.role === "ACCOUNTS") {
    redirect("/accounts");
  } else if (session.user.role === "TEACHER") {
    redirect("/teachers");
  } else if (session.user.role === "MANAGEMENT") {
    redirect("/management");
  } else {
    redirect("/login");
  }
}

