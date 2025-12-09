"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";
import LoadingPage from "@/components/LoadingPage";
import ErrorMessage from "@/components/ErrorMessage";
import FormField from "@/components/FormField";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/accounts";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid username or password");
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/logo.jpg" 
              alt="Gharu Hiraa Logo" 
              className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-blue-100"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Gharu Hiraa</h1>
          <p className="text-gray-600 mt-2">School Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Username" name="username" required>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              placeholder="Enter your username"
              required
              disabled={loading}
            />
          </FormField>

          <FormField label="Password" name="password" required>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </FormField>

          {error && <ErrorMessage message={error} className="mb-4" />}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingPage message="Loading login form..." />}>
      <LoginForm />
    </Suspense>
  );
}

