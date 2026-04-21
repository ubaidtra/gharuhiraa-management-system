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
    fetch("/api/signup")
      .then((r) => r.json())
      .then((d) => {
        setSignupEnabled(d.signupEnabled);
        if (!d.signupEnabled) setError("Signup disabled. Users exist.");
      })
      .catch(() => setError("Failed to check signup status"))
      .finally(() => setChecking(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) return setError("Passwords do not match");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    setLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Failed to create account");

      const result = await signIn("credentials", { username, password, redirect: false });
      if (result?.error) {
        setError("Account created. Please log in.");
        setTimeout(() => router.push("/login"), 2000);
      } else if (result?.ok) {
        window.location.href = "/accounts";
      }
    } catch {
      setError("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-8">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Checking signup availability...</p>
        </div>
      </div>
    );
  }

  if (!signupEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 mx-auto">
          <div className="text-center mb-8">
            <img src="/logo.jpg" alt="Logo" className="w-24 h-24 rounded-full mx-auto mb-4 shadow-lg border-4 border-blue-100" />
            <h1 className="text-3xl font-bold text-gray-800">Gharu Hiraa</h1>
          </div>
          <ErrorMessage message="Signup is disabled. Users already exist. Use login." />
          <button onClick={() => router.push("/login")} className="w-full mt-4 btn-primary">Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 mx-auto">
        <div className="text-center mb-8">
          <img src="/logo.jpg" alt="Logo" className="w-24 h-24 rounded-full mx-auto mb-4 shadow-lg border-4 border-blue-100" />
          <h1 className="text-3xl font-bold text-gray-800">Gharu Hiraa</h1>
          <p className="text-gray-600 mt-2">Create the first Accounts admin (one-time setup)</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Username" name="username" required>
            <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="input-field" placeholder="Username" required disabled={loading} minLength={3} />
          </FormField>
          <FormField label="Password" name="password" required>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="Min 6 characters" required disabled={loading} minLength={6} />
          </FormField>
          <FormField label="Confirm Password" name="confirmPassword" required>
            <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field" placeholder="Confirm" required disabled={loading} />
          </FormField>
          <FormField label="Role" name="role" required>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="input-field" disabled={loading}>
              <option value="ACCOUNTS">Accounts & Admin</option>
            </select>
          </FormField>
          <p className="text-sm text-gray-500 -mt-2">The first account must be able to create users, manage records, and finish initial setup.</p>
          {error && <ErrorMessage message={error} />}
          <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center">
            {loading ? <><LoadingSpinner size="sm" className="mr-2" />Creating...</> : "Create Account"}
          </button>
          <div className="text-center">
            <button type="button" onClick={() => router.push("/login")} className="text-blue-600 hover:text-blue-800 text-sm">Already have an account? Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}
