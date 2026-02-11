import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
      teacherId: string | null;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    role: string;
    teacherId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    teacherId: string | null;
  }
}
