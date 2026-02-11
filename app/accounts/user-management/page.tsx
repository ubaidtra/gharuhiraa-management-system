"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import LoadingSpinner from "@/components/LoadingSpinner";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/components/Toast";
import { ROLE_LABELS } from "@/lib/constants";

export default function UserManagementPage() {
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [resetDialog, setResetDialog] = useState<{ isOpen: boolean; user: any }>({ isOpen: false, user: null });
  const [newPassword, setNewPassword] = useState("");
  const [usernameDialog, setUsernameDialog] = useState<{ isOpen: boolean; user: any }>({ isOpen: false, user: null });
  const [newUsername, setNewUsername] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (session?.user.role !== "ACCOUNTS") redirect("/");
  }, [session, status]);

  useEffect(() => {
    if (session?.user.role === "ACCOUNTS") {
      fetch("/api/users").then((r) => r.json()).then(setUsers).catch(console.error).finally(() => setLoading(false));
    }
  }, [session]);

  const handleResetPassword = async () => {
    if (!resetDialog.user) return;
    const uid = resetDialog.user.id;
    if (!newPassword || newPassword.length < 6) {
      showToast("error", "Password must be at least 6 characters");
      return;
    }
    setActionLoading(uid);
    setResetDialog({ isOpen: false, user: null });
    setNewPassword("");
    try {
      const res = await fetch("/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uid, newPassword }),
      });
      const data = await res.json();
      if (res.ok) showToast("success", data.message || "Password reset");
      else showToast("error", data.error || "Failed");
    } catch { showToast("error", "Failed"); }
    finally { setActionLoading(null); }
  };

  const handleUpdateUsername = async () => {
    if (!usernameDialog.user) return;
    const uid = usernameDialog.user.id;
    if (!newUsername || newUsername.length < 3) {
      showToast("error", "Username must be at least 3 characters");
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(newUsername)) {
      showToast("error", "Username: letters, numbers, underscore, hyphen only");
      return;
    }
    setActionLoading(uid);
    setUsernameDialog({ isOpen: false, user: null });
    setNewUsername("");
    try {
      const res = await fetch("/api/users/update-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uid, newUsername }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.map((u) => (u.id === uid ? { ...u, username: newUsername } : u)));
        showToast("success", data.message || "Username updated");
      } else showToast("error", data.error || "Failed");
    } catch { showToast("error", "Failed"); }
    finally { setActionLoading(null); }
  };

  if (loading || status === "loading") return <LoadingPage message="Loading users..." />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">User Management</h1>
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Teacher ID</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="font-medium">{u.username}</td>
                    <td><span className="px-2 py-1 rounded text-xs bg-gray-100">{ROLE_LABELS[u.role] || u.role}</span></td>
                    <td>{u.teacherId ? "Linked" : "-"}</td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => { setUsernameDialog({ isOpen: true, user: u }); setNewUsername(u.username); }} disabled={actionLoading === u.id} className="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50">
                          {actionLoading === u.id ? <LoadingSpinner size="sm" /> : "Change Username"}
                        </button>
                        <button onClick={() => { setResetDialog({ isOpen: true, user: u }); setNewPassword(""); }} disabled={actionLoading === u.id} className="text-orange-600 hover:text-orange-800 text-sm disabled:opacity-50">
                          Reset Password
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <ConfirmDialog isOpen={resetDialog.isOpen} title="Reset Password" message={resetDialog.user ? `Set new password for ${resetDialog.user.username}` : ""} confirmText="Reset" variant="info" onConfirm={handleResetPassword} onCancel={() => { setResetDialog({ isOpen: false, user: null }); setNewPassword(""); }}>
          {resetDialog.isOpen && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 6 characters" className="input-field w-full" minLength={6} autoComplete="new-password" />
            </div>
          )}
        </ConfirmDialog>

        <ConfirmDialog isOpen={usernameDialog.isOpen} title="Update Username" message={usernameDialog.user ? `New username for ${usernameDialog.user.username}` : ""} confirmText="Update" variant="info" onConfirm={handleUpdateUsername} onCancel={() => { setUsernameDialog({ isOpen: false, user: null }); setNewUsername(""); }}>
          {usernameDialog.isOpen && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">New Username</label>
              <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="Letters, numbers, _ -" className="input-field w-full" minLength={3} />
            </div>
          )}
        </ConfirmDialog>
      </div>
    </div>
  );
}
