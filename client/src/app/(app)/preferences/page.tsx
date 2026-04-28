"use client";

import { useEffect, useState } from "react";
import {
  User,
  Shield,
  Bell,
  LogOut,
  ChevronRight,
  CircleUserRound,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Modal from "@/components/ui/Modal"; // ✅ make sure your Modal file is here
import Toast from "@/components/ui/Toast";
import { getMe, updateMe } from "@/lib/api/user";

const toAbsoluteImageUrl = (value?: string) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  const base = process.env.NEXT_PUBLIC_API_URL || "";
  return `${base}${value.startsWith("/") ? value : `/${value}`}`;
};

const PreferenceItem = ({
  icon,
  label,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick?: () => void;
}) => (
  <div
    className="flex items-center justify-between p-4 hover:bg-neutral-grey3 dark:hover:bg-neutral-grey1 rounded-lg cursor-pointer transition-colors"
    onClick={onClick}
  >
    <div className="flex items-center gap-4">
      <div className="text-neutral-grey2 dark:text-neutral-grey3">{icon}</div>
      <div>
        <div className="font-semibold text-neutral-dark1 dark:text-neutral-white">
          {label}
        </div>
        <div className="text-sm text-neutral-grey2 dark:text-neutral-grey3">
          {description}
        </div>
      </div>
    </div>
    <ChevronRight className="w-5 h-5 text-neutral-grey2 dark:text-neutral-grey3" />
  </div>
);

const PreferencesPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{
    id: string;
    email: string;
    name: string;
    phone: string;
    image?: string;
  } | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", image: "" });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "success",
  );
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setError(null);
        const data = await getMe();
        const profileData = data.profile_data ?? {};
        const image = toAbsoluteImageUrl(profileData.image);
        setUser({
          id: data.id,
          email: data.email,
          name: profileData.name ?? "",
          phone: data.phone ?? "",
          image,
        });
        setForm({
          name: profileData.name ?? "",
          phone: data.phone ?? "",
          image: profileData.image ?? "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async () => {
    if (!user) return;
    try {
      setIsUpdating(true);
      setError(null);
      setToastOpen(false);
      setToastMessage("");
      await updateMe({
        phone: form.phone,
        profile_data: {
          name: form.name,
          image: form.image,
        },
      });

      setUser((prev) =>
        prev
          ? {
              ...prev,
              name: form.name,
              phone: form.phone,
              image: toAbsoluteImageUrl(form.image),
            }
          : prev,
      );
      setShowModal(false);
        setToastType("success");
        setToastMessage("Profile saved successfully");
        setToastOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setToastType("error");
        setToastMessage("New password and confirmation do not match!");
        setToastOpen(true);
      return;
    }

      setToastType("info");
      setToastMessage("Password update API is not available yet on backend.");
      setToastOpen(true);
    setShowPasswordModal(false);
  };

  const handleLogout = () => signOut({ callbackUrl: "/login" });

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 md:mb-0">
        <div className="md:col-span-1">
          <div className="bg-neutral-white dark:bg-neutral-dark2 p-6 rounded-xl shadow-md flex flex-col items-center text-center gap-4">
            <div className="w-24 h-24 rounded-full bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse" />
            <div className="h-4 w-40 rounded bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse" />
            <div className="h-4 w-32 rounded bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse" />
          </div>
        </div>
        <div className="md:col-span-2 space-y-4">
          <div className="h-24 rounded-xl bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse" />
          <div className="h-24 rounded-xl bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse" />
          <div className="h-16 rounded-xl bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 md:mb-0">
      {/* Profile Card */}
      <div className="md:col-span-1">
        <div className="bg-neutral-white dark:bg-neutral-dark2 p-6 rounded-xl shadow-md flex flex-col items-center text-center">
          {user?.image ? (
            <Image
              src={user.image}
              alt="Profile Picture"
              width={96}
              height={96}
              className="rounded-full mb-4 border-2 border-primary-brand object-cover"
            />
          ) : (
            <CircleUserRound className="w-24 h-24 mb-4 text-neutral-grey2 dark:text-neutral-grey3 border-2 border-primary-brand rounded-full" />
          )}
          <h2 className="text-xl font-bold text-neutral-dark1 dark:text-neutral-white">
            {user?.name || user?.email?.split("@")[0] || "User"}
          </h2>
          <p className="text-sm text-neutral-grey2 dark:text-neutral-grey3 mt-1">
            {user?.email ?? ""}
          </p>
          <p className="text-sm text-neutral-grey2 dark:text-neutral-grey3 mt-1">
            {user?.phone || "No phone added"}
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 w-full bg-primary-brand/20 text-primary-brand font-semibold py-2 px-4 rounded-lg hover:bg-primary-brand/30 transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Right column */}
      <div className="md:col-span-2 space-y-8">
        {error ? <p className="text-system-red text-sm px-2">{error}</p> : null}

        <div className="bg-neutral-white dark:bg-neutral-dark2 p-4 rounded-xl shadow-md">
          <h3 className="font-bold text-lg text-neutral-dark1 dark:text-neutral-white px-4 pb-2">
            My Account
          </h3>

          <PreferenceItem
            icon={<User size={24} />}
            label="Personal Info"
            description="Update your information"
            onClick={() => router.push("/profile")}
          />
          <PreferenceItem
            icon={<Shield size={24} />}
            label="Security"
            description="Change your password"
            onClick={() => setShowPasswordModal(true)}
          />
        </div>

        <div className="bg-neutral-white dark:bg-neutral-dark2 p-4 rounded-xl shadow-md">
          <h3 className="font-bold text-lg text-neutral-dark1 dark:text-neutral-white px-4 pb-2">
            Settings
          </h3>
          <PreferenceItem
            icon={<Bell size={24} />}
            label="Notifications"
            description="Manage notifications"
            onClick={() => router.push("/notifications")}
          />
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 text-left p-4 bg-neutral-white dark:bg-neutral-dark2 rounded-xl shadow-md text-system-red font-semibold hover:bg-system-red/10 transition-colors"
        >
          <LogOut size={24} />
          <span>Logout</span>
        </button>
      </div>

      {/* Edit Profile Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white dark:bg-neutral-dark2 p-6 rounded-xl shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">Edit Profile</h2>
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="text"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full p-2 border rounded mb-3"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="px-4 py-2 rounded bg-primary-brand text-white hover:bg-primary-brand/80"
              >
                {isUpdating ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Change Password Modal using reusable Modal */}
      <Modal
        className="p-6"
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
        actions={
          <>
            <button
              onClick={() => setShowPasswordModal(false)}
              className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handlePasswordUpdate}
              className="px-4 py-2 rounded bg-primary-brand text-white hover:bg-primary-brand/80"
            >
              Save
            </button>
          </>
        }
      >
        <div className="space-y-6">
          <input
            type="password"
            placeholder="Current Password"
            value={passwordForm.currentPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                currentPassword: e.target.value,
              })
            }
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="New Password"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, newPassword: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Retype New Password"
            value={passwordForm.confirmPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                confirmPassword: e.target.value,
              })
            }
            className="w-full p-2 border rounded"
          />
        </div>
      </Modal>

      <Toast
        open={toastOpen}
        message={toastMessage}
        type={toastType}
        duration={3000}
        onClose={() => setToastOpen(false)}
      />
    </div>
  );
};

export default PreferencesPage;
