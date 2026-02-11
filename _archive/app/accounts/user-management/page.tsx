"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { getRoleDisplayName } from "@/lib/roleDisplay";

export default function UserManagementPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resettingUserId, setResettingUserId] = useState<string | null>(null);
  const [resetForm, setResetForm] = useState<{
    userId: string;
    username: string;
    role: string;
  } | null>(null);
  const [editForm, setEditForm] = useState<{
    userId: string;
    currentUsername: string;
    role: string;
  } | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editMessage, setEditMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
    if (session?.user.role !== "ACCOUNTS") {
      redirect("/");
    }
  }, [session, status]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        } else {
          console.error("Failed to fetch users");
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user.role === "ACCOUNTS") {
      fetchUsers();
    }
  }, [session]);

  const handleOpenResetForm = (user: any) => {
    setResetForm({
      userId: user.id,
      username: user.username,
      role: user.role,
    });
    setNewPassword("");
    setConfirmPassword("");
    setMessage(null);
  };

  const handleCloseResetForm = () => {
    setResetForm(null);
    setNewPassword("");
    setConfirmPassword("");
    setMessage(null);
  };

  const handleOpenEditForm = (user: any) => {
    setEditForm({
      userId: user.id,
      currentUsername: user.username,
      role: user.role,
    });
    setNewUsername("");
    setEditMessage(null);
  };

  const handleCloseEditForm = () => {
    setEditForm(null);
    setNewUsername("");
    setEditMessage(null);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetForm) return;

    // Validation
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters long" });
      return;
    }

    setResettingUserId(resetForm.userId);
    setMessage(null);

    try {
      const res = await fetch("/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: resetForm.userId,
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: `Password reset successfully for ${data.username}`,
        });
        // Clear form after 2 seconds
        setTimeout(() => {
          handleCloseResetForm();
        }, 2000);
      } else {
        setMessage({ type: "error", text: data.error || "Failed to reset password" });
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setResettingUserId(null);
    }
  };

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editForm) return;

    // Validation
    if (newUsername.length < 3) {
      setEditMessage({ type: "error", text: "Username must be at least 3 characters long" });
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(newUsername)) {
      setEditMessage({ 
        type: "error", 
        text: "Username can only contain letters, numbers, underscores, and hyphens" 
      });
      return;
    }

    if (newUsername === editForm.currentUsername) {
      setEditMessage({ type: "error", text: "New username must be different from current username" });
      return;
    }

    setResettingUserId(editForm.userId);
    setEditMessage(null);

    try {
      const res = await fetch("/api/users/update-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: editForm.userId,
          newUsername,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setEditMessage({
          type: "success",
          text: `Username updated from "${data.oldUsername}" to "${data.newUsername}"`,
        });
        
        // Update users list
        setUsers(users.map(u => 
          u.id === editForm.userId ? { ...u, username: data.newUsername } : u
        ));

        // Clear form after 2 seconds
        setTimeout(() => {
          handleCloseEditForm();
        }, 2000);
      } else {
        setEditMessage({ type: "error", text: data.error || "Failed to update username" });
      }
    } catch (error) {
      console.error("Error updating username:", error);
      setEditMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setResettingUserId(null);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">User Management</h1>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-blue-600 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Administrator Access</p>
              <p>
                As {getRoleDisplayName("ACCOUNTS")}, you can reset passwords for all users.
                Use this power responsibly and only when necessary.
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">All User Accounts</h2>

          {users.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No users found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="font-medium text-gray-900">{user.username}</td>
                      <td>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            user.role === "MANAGEMENT"
                              ? "bg-purple-100 text-purple-800"
                              : user.role === "ACCOUNTS"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {getRoleDisplayName(user.role)}
                        </span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleOpenEditForm(user)}
                            className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center gap-1"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleOpenResetForm(user)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                              />
                            </svg>
                            Reset Pass
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-yellow-600 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Important Security Notice</p>
              <ul className="list-disc ml-4 space-y-1">
                <li>Always inform users when resetting their passwords</li>
                <li>Choose strong, secure passwords (minimum 6 characters)</li>
                <li>Advise users to change passwords after reset</li>
                <li>Keep password reset actions confidential</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      {resetForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Reset Password</h3>
                <button
                  onClick={handleCloseResetForm}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={resettingUserId !== null}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600">Resetting password for:</p>
                <p className="font-semibold text-gray-900 text-lg">{resetForm.username}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Role: <span className="font-medium">{getRoleDisplayName(resetForm.role)}</span>
                </p>
              </div>

              {message && (
                <div
                  className={`rounded-lg p-3 mb-4 ${
                    message.type === "success"
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {message.type === "success" ? (
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                    <p
                      className={`text-sm font-medium ${
                        message.type === "success" ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {message.text}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password *
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-field"
                    placeholder="Enter new password (min 6 characters)"
                    minLength={6}
                    required
                    disabled={resettingUserId !== null}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field"
                    placeholder="Re-enter new password"
                    minLength={6}
                    required
                    disabled={resettingUserId !== null}
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={resettingUserId !== null}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resettingUserId ? "Resetting..." : "Reset Password"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseResetForm}
                    disabled={resettingUserId !== null}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Username Modal */}
      {editForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Edit Username</h3>
                <button
                  onClick={handleCloseEditForm}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={resettingUserId !== null}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600">Editing username for:</p>
                <p className="font-semibold text-gray-900 text-lg">{editForm.currentUsername}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Role: <span className="font-medium">{getRoleDisplayName(editForm.role)}</span>
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> Changing username will affect user login. Make sure to inform
                  the user about the new username.
                </p>
              </div>

              {editMessage && (
                <div
                  className={`rounded-lg p-3 mb-4 ${
                    editMessage.type === "success"
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {editMessage.type === "success" ? (
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                    <p
                      className={`text-sm font-medium ${
                        editMessage.type === "success" ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {editMessage.text}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleUpdateUsername} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Username *
                  </label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="input-field"
                    placeholder="Enter new username (min 3 characters)"
                    minLength={3}
                    pattern="[a-zA-Z0-9_-]+"
                    title="Only letters, numbers, underscores, and hyphens allowed"
                    required
                    disabled={resettingUserId !== null}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Only letters, numbers, underscores (_), and hyphens (-) allowed
                  </p>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={resettingUserId !== null}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resettingUserId ? "Updating..." : "Update Username"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseEditForm}
                    disabled={resettingUserId !== null}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

