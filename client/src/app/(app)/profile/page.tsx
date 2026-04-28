"use client";

import { useState, useEffect } from "react";
import FormInput from "@/components/ui/FormInput";
import Button from "@/components/ui/Button";
import { CircleUserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getMe, updateMe } from "@/lib/api/user";

const toAbsoluteImageUrl = (value?: string) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  const base = process.env.NEXT_PUBLIC_API_URL || "";
  return `${base}${value.startsWith("/") ? value : `/${value}`}`;
};

export default function ProfileInfo() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    image: "",
    email: "",
    phone: "", // Added phone field
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setError(null);
        const data = await getMe();

        const profileData = data.profile_data ?? {};
        setProfile({
          name: profileData.name ?? "",
          address: profileData.address ?? "",
          city: profileData.city ?? "",
          state: profileData.state ?? "",
          pinCode: profileData.pinCode ?? "",
          image: toAbsoluteImageUrl(profileData.image),
          email: data.email,
          phone: data.phone ?? "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setSaving(true);
        setError(null);
        const image = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === "string") {
              resolve(reader.result);
            } else {
              reject(new Error("Failed to read image file"));
            }
          };
          reader.onerror = () => reject(new Error("Failed to read image file"));
          reader.readAsDataURL(file);
        });

        const updated = await updateMe({
          profile_data: {
            name: profile.name,
            address: profile.address,
            city: profile.city,
            state: profile.state,
            pinCode: profile.pinCode,
            image,
          },
        });

        setProfile((prev) => ({
          ...prev,
          image: toAbsoluteImageUrl(updated.profile_data?.image),
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Image upload failed");
      } finally {
        setSaving(false);
      }
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      await updateMe({
        phone: profile.phone.trim() || undefined,
        profile_data: {
          name: profile.name,
          address: profile.address,
          city: profile.city,
          state: profile.state,
          pinCode: profile.pinCode,
          image: profile.image,
        },
      });
      alert("Profile updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen md:p-8 p-4">
        <div className="max-w-4xl mx-auto rounded-2xl bg-card p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-32 h-32 rounded-full bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse" />
            <div className="h-4 w-28 rounded bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse" />
          </div>
          <div className="md:col-span-2 space-y-3">
            <div className="h-10 rounded-md bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse" />
            <div className="h-10 rounded-md bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse" />
            <div className="h-10 rounded-md bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse" />
            <div className="h-10 rounded-md bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse" />
            <div className="h-10 rounded-md bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse" />
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-background md:p-8 p-4 mb-10 md:mb-0">
      <div className="max-w-4xl mx-auto rounded-2xl shadow-2xl bg-card p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="flex flex-col items-center space-y-4">
          {profile.image ? (
            <Image
              src={profile.image}
              alt="Profile"
              width={128}
              height={128}
              className="w-32 h-32 rounded-full object-cover shadow-md"
            />
          ) : (
            <CircleUserRound className="w-32 h-32 rounded-full object-cover shadow-md" />
          )}
          <label className="cursor-pointer text-sm text-primary hover:underline">
            Change Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          <p className="text-muted-foreground">{profile.email}</p>
        </div>

        {/* Right Column */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Profile Details
          </h2>

          {error ? <p className="text-system-red text-sm">{error}</p> : null}

          <FormInput
            label="Full Name"
            name="name"
            value={profile.name}
            onChange={handleChange}
            placeholder="John Doe"
          />
          <FormInput
            label="Phone"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            placeholder="123-456-7890"
          />
          <FormInput
            label="Address"
            name="address"
            value={profile.address}
            onChange={handleChange}
            placeholder="123 Street, Area"
          />
          <FormInput
            label="City"
            name="city"
            value={profile.city}
            onChange={handleChange}
            placeholder="Mumbai"
          />
          <FormInput
            label="State"
            name="state"
            value={profile.state}
            onChange={handleChange}
            placeholder="Maharashtra"
          />
          <FormInput
            label="Pin Code"
            name="pinCode"
            value={profile.pinCode}
            onChange={handleChange}
            placeholder="400001"
          />

          <Button
            onClick={handleSave}
            disabled={saving}
            className="mt-4 w-full md:w-auto shadow-md hover:shadow-lg"
          >
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button
            onClick={() => router.push("/dashboard")}
            className="mt-4 w-full md:w-auto shadow-md hover:shadow-lg md:ml-4"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
