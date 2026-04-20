"use client";

import { useEffect, useState } from "react";
import FormInput from "@/components/ui/FormInput";
import Button from "@/components/ui/Button";
import { Mail, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api/auth";
import Toast from "@/components/ui/Toast";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "error",
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await registerUser({
        email,
        password,
        confirmPassword: password,
      });

      // Store tokens
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);

      // Store user (optional)
      localStorage.setItem("user", JSON.stringify(res.user));

      // Redirect directly to dashboard (user is already logged in)
      router.push("/dashboard");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Registration failed";
      setToastMessage(message);
      setToastType("error");
      setToastOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    // The corrected code
    <div className="flex flex-col md:flex-row min-h-screen md:h-screen w-full justify-center">
      {/* left: form */}
      <div className="relative z-10 w-full md:w-5/12 flex flex-col items-center  h-full px-4 justify-center space-y-4">
        {/* logo */}
        <div>
          <div className="bg-primary-brand w-14 h-14 rounded-full flex items-center justify-center shadow-md md:mt-8 ">
            <Image
              src="/assets/bag-icon.svg"
              alt="Bag"
              width={26}
              height={26}
            />
          </div>
        </div>

        {/* title */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold dark:text-neutral-white text-neutral-dark1">
            Create an account
          </h1>
          <p className="dark:text-neutral-grey3 text-sm">
            Sign up now and unlock exclusive access!
          </p>
        </div>

        {/* social buttons */}
        <div className="flex justify-center gap-1 md:gap-4 ">
          <Button
            variant="social"
            type="button"
            aria-label="Sign up with Google"
          >
            <Image
              src="/assets/google-icon.svg"
              alt="Google"
              width={22}
              height={22}
            />
          </Button>
          <Button
            variant="social"
            type="button"
            aria-label="Sign up with Facebook"
          >
            <Image
              src="/assets/facebook-icon.svg"
              alt="Facebook"
              width={22}
              height={22}
            />
          </Button>
          <Button
            variant="social"
            type="button"
            aria-label="Sign up with Apple"
          >
            <Image
              src="/assets/apple-icon-light.svg"
              alt="Apple"
              width={22}
              height={22}
              className="block dark:hidden"
            />
            <Image
              src="/assets/apple-icon-dark.svg"
              alt="Apple"
              width={22}
              height={22}
              className="hidden dark:block"
            />
          </Button>
          <Button
            variant="social"
            type="button"
            aria-label="Sign up with Twitter"
          >
            <Image
              src="/assets/x-icon-light.svg"
              alt="Twitter"
              width={22}
              height={22}
              className="block dark:hidden"
            />
            <Image
              src="/assets/x-icon-dark.svg"
              alt="Twitter"
              width={22}
              height={22}
              className="hidden dark:block"
            />
          </Button>
        </div>

        {/* divider */}
        <div className="flex items-center w-full max-w-sm">
          <hr className="flex-grow border-neutral-grey1" />
          <span className="px-3 text-xs dark:text-neutral-white text-neutral-grey3">
            OR
          </span>
          <hr className="flex-grow border-neutral-grey1" />
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <FormInput
            label="Email"
            type="email"
            placeholder="helloexample@gmail.com"
            required
            icon={<Mail className="w-5 h-5 text-neutral-grey3" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <FormInput
            label="Password"
            variant="password"
            placeholder="••••••••••••"
            required
            icon={<Lock className="w-5 h-5 text-neutral-grey3" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center text-sm">
            <input
              id="terms"
              required
              type="checkbox"
              className="w-4 h-4 text-primary-brand rounded border-neutral-grey1 focus:ring-primary-brand"
            />
            <label
              htmlFor="terms"
              className="ml-2 text-neutral-dark2 dark:text-neutral-white"
            >
              I agree to the{" "}
              <a
                href="#"
                className="text-neutral-dark1 dark:text-primary-brand underline"
              >
                terms of service
              </a>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
            className="w-full max-w-sm h-12 text-lg font-semibold rounded-lg"
          >
            {loading ? "Creating account..." : "Sign up"}
          </Button>
        </form>

        {/* footer link */}
        <p className="text-sm text-center text-neutral-dark2 dark:text-neutral-grey3">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-neutral-dark2 dark:text-primary-brand underline"
          >
            Login
          </Link>
        </p>
      </div>

      {/* right: image */}
      <div className="hidden md:block md:w-7/12 h-full relative">
        <Image
          src="/assets/tree.png"
          alt="Serene tree"
          fill
          className="object-cover rounded-3xl p-1"
        />
      </div>
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

export default RegisterPage;
