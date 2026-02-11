"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import FormField from "@/components/FormField";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("ACCOUNTS");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [signupEnabled, setSignupEnabled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSignupStatus = async () => {
      try {
        const res = await fetch("/api/signup");
        const data = await res.json();
        setSignupEnabled(data.signupEnabled);
        if (!data.signupEnabled) {
          setError("Signup is disabled. Users already exist in the system. Please use the login page.");
        }
      } catch (err) {
        setError("Failed to check signup status");
      } finally {
        setChecking(false);
      }
    };

    checkSignupStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create account");
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created but login failed. Please try logging in.");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else if (result?.ok) {
        window.location.href = role === "ACCOUNTS" ? "/accounts" : role === "MANAGEMENT" ? "/management" : "/teachers";
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Checking signup availability...</p>
        </div>
      </div>
    );
  }

  if (!signupEnabled) {
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
          <ErrorMessage message="Signup is disabled. Users already exist in the system. Please use the login page." />
          <button
            onClick={() => router.push("/login")}
            className="w-full mt-4 btn-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

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
          <p className="text-gray-600 mt-2">Create Admin Account</p>
          <p className="text-sm text-orange-600 mt-2 font-semibold">
            ⚠️ One-time setup only
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Username" name="username" required>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              placeholder="Enter username"
              required
              disabled={loading}
              minLength={3}
            />
          </FormField>

          <FormField label="Password" name="password" required>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Enter password (min 6 characters)"
              required
              disabled={loading}
              minLength={6}
            />
          </FormField>

          <FormField label="Confirm Password" name="confirmPassword" required>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field"
              placeholder="Confirm password"
              required
              disabled={loading}
              minLength={6}
            />
          </FormField>

          <FormField label="Role" name="role" required>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="input-field"
              required
              disabled={loading}
            >
              <option value="ACCOUNTS">Accounts & Admin (Full Access)</option>
              <option value="MANAGEMENT">Management (Read Only)</option>
              <option value="TEACHER">Teacher</option>
            </select>
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
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Already have an account? Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

