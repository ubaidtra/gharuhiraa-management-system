import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Redirect based on role
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
}

