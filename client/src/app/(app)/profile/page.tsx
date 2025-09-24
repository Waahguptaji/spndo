"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import FormInput from "@/components/ui/FormInput";
import Button from "@/components/ui/Button";
import { CircleUserRound } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfileInfo() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
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

  // 🔹 Fetch user details on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.warn("No userId in localStorage.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/user?id=${userId}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setProfile({
            name: data.data.name || "",
            address: data.data.address || "",
            city: data.data.city || "",
            state: data.data.state || "",
            pinCode: data.data.pinCode || "",
            image: data.data.image || session?.user?.image || "",
            email: data.data.email,
            phone: data.data.phone || "", // Added phone field
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile({ ...profile, image: reader.result as string }); // base64 string
    };
    reader.readAsDataURL(file);
  }
  };

  const handleSave = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not found in localStorage. Please login again.");
      return;
    }

    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          name: profile.name,
          address: profile.address,
          city: profile.city,
          state: profile.state,
          pinCode: profile.pinCode,
          image: profile.image, // ✅ save image
          phone: profile.phone || "", // Added phone field
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Profile updated successfully!");
      } else {
        alert(data.message || "Error updating profile");
      }
    } catch (err) {
      console.error("Save failed:", err);
      alert("Something went wrong.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-background md:p-8 p-4 mb-10 md:mb-0">
      <div className="max-w-4xl mx-auto rounded-2xl shadow-2xl bg-card p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="flex flex-col items-center space-y-4">
          {profile.image ? (
            <img
              src={profile.image}
              alt="Profile"
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
            className="mt-4 w-full md:w-auto shadow-md hover:shadow-lg"
          >
            Save
          </Button>
           <Button
            onClick={() => router.push('/dashboard')}
            className="mt-4 w-full md:w-auto shadow-md hover:shadow-lg md:ml-4"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
