"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import LoadingSpinner from "@/components/LoadingSpinner";
import ConfirmDialog from "@/components/ConfirmDialog";
import FormField from "@/components/FormField";
import FormSelect from "@/components/FormSelect";
import { useToast } from "@/components/Toast";
import { ROLE_LABELS } from "@/lib/constants";
import type { User, UserRole } from "@/types/user";
import type { Teacher } from "@/types/teacher";

type ManagedUser = User;
type TeacherProfile = Pick<Teacher, "id" | "teacherId" | "firstName" | "lastName" | "isActive">;

const roleOptions = [
  { value: "ACCOUNTS", label: ROLE_LABELS.ACCOUNTS },
  { value: "MANAGEMENT", label: ROLE_LABELS.MANAGEMENT },
  { value: "TEACHER", label: ROLE_LABELS.TEACHER },
];

export default function UserManagementPage() {
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [resetDialog, setResetDialog] = useState<{ isOpen: boolean; user: ManagedUser | null }>({ isOpen: false, user: null });
  const [newPassword, setNewPassword] = useState("");
  const [usernameDialog, setUsernameDialog] = useState<{ isOpen: boolean; user: ManagedUser | null }>({ isOpen: false, user: null });
  const [newUsername, setNewUsername] = useState("");
  const [linkDialog, setLinkDialog] = useState<{ isOpen: boolean; user: ManagedUser | null }>({ isOpen: false, user: null });
  const [linkedTeacherId, setLinkedTeacherId] = useState("");
  const [createForm, setCreateForm] = useState({
    username: "",
    password: "",
    role: "ACCOUNTS" as UserRole,
    teacherId: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (session?.user.role !== "ACCOUNTS") redirect("/");
  }, [session, status]);

  useEffect(() => {
    if (session?.user.role === "ACCOUNTS") {
      Promise.all([fetch("/api/users"), fetch("/api/teachers")])
        .then(async ([usersResponse, teachersResponse]) => {
          const [usersData, teachersData] = await Promise.all([usersResponse.json(), teachersResponse.json()]);
          setUsers(Array.isArray(usersData) ? usersData : []);
          setTeachers(Array.isArray(teachersData) ? teachersData : []);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [session]);

  const resetCreateForm = () => {
    setCreateForm({ username: "", password: "", role: "ACCOUNTS", teacherId: "" });
  };

  const teacherLabel = (teacher?: ManagedUser["Teacher"] | TeacherProfile | null) => {
    if (!teacher) return "Not linked";
    return `${teacher.teacherId} - ${teacher.firstName} ${teacher.lastName}${teacher.isActive ? "" : " (inactive)"}`;
  };

  const availableTeacherOptions = (currentTeacherId?: string | null) => {
    return teachers
      .filter((teacher) => teacher.isActive || teacher.id === currentTeacherId)
      .map((teacher) => ({ value: teacher.id, label: teacherLabel(teacher) }));
  };

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCreateForm((prev) => {
      if (name === "role") {
        return {
          ...prev,
          role: value as UserRole,
          teacherId: value === "TEACHER" ? prev.teacherId : "",
        };
      }

      return { ...prev, [name]: value };
    });
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.username.trim() || !createForm.password) {
      showToast("error", "Username and password are required");
      return;
    }
    if (createForm.role === "TEACHER" && !createForm.teacherId) {
      showToast("error", "Select a teacher profile for teacher accounts");
      return;
    }

    setActionLoading("create-user");
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: createForm.username.trim(),
          password: createForm.password,
          role: createForm.role,
          teacherId: createForm.role === "TEACHER" ? createForm.teacherId : null,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        showToast("error", data.error || "Failed to create user");
        return;
      }

      setUsers((prev) => [data, ...prev]);
      resetCreateForm();
      showToast("success", "User created");
    } catch {
      showToast("error", "Failed to create user");
    } finally {
      setActionLoading(null);
    }
  };

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

  const handleSaveTeacherLink = async () => {
    if (!linkDialog.user) return;
    const uid = linkDialog.user.id;
    setActionLoading(uid);
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uid, teacherId: linkedTeacherId || null }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.map((u) => (u.id === uid ? data : u)));
        showToast("success", linkedTeacherId ? "Teacher profile linked" : "Teacher profile unlinked");
        setLinkDialog({ isOpen: false, user: null });
        setLinkedTeacherId("");
      } else {
        showToast("error", data.error || "Failed");
      }
    } catch {
      showToast("error", "Failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading || status === "loading") return <LoadingPage message="Loading users..." />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">User Management</h1>
        <form onSubmit={handleCreateUser} className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create User</h2>
              <p className="text-sm text-gray-500 mt-1">Create additional accounts and link teacher logins to teacher profiles.</p>
            </div>
            <p className="text-sm text-gray-500">{teachers.filter((teacher) => teacher.isActive).length} active teacher profiles</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Username" name="username" required>
              <input
                id="username"
                name="username"
                type="text"
                value={createForm.username}
                onChange={handleCreateChange}
                className="input-field"
                minLength={3}
                required
                disabled={actionLoading === "create-user"}
              />
            </FormField>
            <FormField label="Password" name="password" required>
              <input
                id="password"
                name="password"
                type="password"
                value={createForm.password}
                onChange={handleCreateChange}
                className="input-field"
                minLength={6}
                required
                disabled={actionLoading === "create-user"}
              />
            </FormField>
            <FormSelect
              label="Role"
              name="role"
              value={createForm.role}
              onChange={handleCreateChange}
              options={roleOptions}
              disabled={actionLoading === "create-user"}
            />
            <FormSelect
              label="Teacher Profile"
              name="teacherId"
              value={createForm.teacherId}
              onChange={handleCreateChange}
              options={[{ value: "", label: createForm.role === "TEACHER" ? "Select teacher profile" : "Not required" }, ...availableTeacherOptions()]}
              disabled={createForm.role !== "TEACHER" || actionLoading === "create-user"}
              required={createForm.role === "TEACHER"}
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={actionLoading === "create-user"} className="btn-primary flex items-center gap-2">
              {actionLoading === "create-user" ? <LoadingSpinner size="sm" /> : null}
              Create User
            </button>
            <button type="button" onClick={resetCreateForm} className="btn-secondary" disabled={actionLoading === "create-user"}>
              Reset
            </button>
          </div>
        </form>

        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Teacher Link</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="font-medium">{u.username}</td>
                    <td><span className="px-2 py-1 rounded text-xs bg-gray-100">{ROLE_LABELS[u.role] || u.role}</span></td>
                    <td>{teacherLabel(u.Teacher)}</td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => { setUsernameDialog({ isOpen: true, user: u }); setNewUsername(u.username); }} disabled={actionLoading === u.id} className="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50">
                          {actionLoading === u.id ? <LoadingSpinner size="sm" /> : "Change Username"}
                        </button>
                        <button onClick={() => { setResetDialog({ isOpen: true, user: u }); setNewPassword(""); }} disabled={actionLoading === u.id} className="text-orange-600 hover:text-orange-800 text-sm disabled:opacity-50">
                          Reset Password
                        </button>
                        {u.role === "TEACHER" && (
                          <button
                            onClick={() => {
                              setLinkDialog({ isOpen: true, user: u });
                              setLinkedTeacherId(u.teacherId || "");
                            }}
                            disabled={actionLoading === u.id}
                            className="text-green-600 hover:text-green-800 text-sm disabled:opacity-50"
                          >
                            {u.teacherId ? "Change Teacher Link" : "Link Teacher"}
                          </button>
                        )}
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

        <ConfirmDialog
          isOpen={linkDialog.isOpen}
          title="Link Teacher Profile"
          message={linkDialog.user ? `Select the teacher profile for ${linkDialog.user.username}` : ""}
          confirmText="Save"
          variant="info"
          onConfirm={handleSaveTeacherLink}
          onCancel={() => { setLinkDialog({ isOpen: false, user: null }); setLinkedTeacherId(""); }}
        >
          {linkDialog.isOpen && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Teacher Profile</label>
              <select value={linkedTeacherId} onChange={(e) => setLinkedTeacherId(e.target.value)} className="input-field w-full">
                <option value="">No linked teacher profile</option>
                {availableTeacherOptions(linkDialog.user?.teacherId).map((teacher) => (
                  <option key={teacher.value} value={teacher.value}>
                    {teacher.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </ConfirmDialog>
      </div>
    </div>
  );
}
