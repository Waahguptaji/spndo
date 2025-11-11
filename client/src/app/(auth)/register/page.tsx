"use client";

// import { useEffect, useState } from "react";
import FormInput from "@/components/ui/FormInput";
import Button from "@/components/ui/Button";
import { Mail, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
// import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RegisterSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { PiPerson } from "react-icons/pi";
const RegisterPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
  });

  // const router = useRouter();
  // useEffect(() => {
  //   if (status === "authenticated") {
  //     router.replace("/dashboard"); // replace avoids back/forward issue
  //   }
  // }, [status, router]);
  // if (status === "loading") {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       <p className="text-lg">Loading...</p>
  //     </div>
  //   );
  // }

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    // const res = await fetch("/api/register", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     email: data.email,
    //     password: data.password,
    //     name: data.name,
    //   }),
    // });

    // const result = await res.json();
    // if (res.ok) {
    //   const newUser = result.user;
    //   localStorage.setItem("userId", newUser.id);
    //   alert("Account created successfully! Please log in.");
    //   router.push("/login");
    // } else {
    //   alert(result.message || "Registration failed. User may already exist.");
    // }
    console.log("Form Data:", data);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen md:h-screen w-full justify-center">
      <div className="relative z-10 w-full md:w-5/12 flex flex-col items-center  h-full px-4 justify-center space-y-4">
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

        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold dark:text-neutral-white text-neutral-dark1">
            Create an account
          </h1>
          <p className="dark:text-neutral-grey3 text-sm">
            Sign up now and unlock exclusive access!
          </p>
        </div>

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

        <div className="flex items-center w-full max-w-sm">
          <hr className="flex-grow border-neutral-grey1" />
          <span className="px-3 text-xs dark:text-neutral-white text-neutral-grey3">
            OR
          </span>
          <hr className="flex-grow border-neutral-grey1" />
        </div>

        {/* form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-sm space-y-4"
        >
          <FormInput
            label="Name"
            type="text"
            placeholder="John Doe"
            leadingIcon={<PiPerson className="w-5 h-5 text-neutral-grey3" />}
            {...register("name")}
            error={errors.name?.message}
          />
          <FormInput
            label="Email"
            type="text"
            placeholder="helloexample@gmail.com"
            leadingIcon={<Mail className="w-5 h-5 text-neutral-grey3" />}
            {...register("email")}
            error={errors.email?.message}
          />

          <FormInput
            label="Password"
            variant="password"
            placeholder="••••••••••••"
            leadingIcon={<Lock className="w-5 h-5 text-neutral-grey3" />}
            {...register("password")}
            error={errors.password?.message}
          />

          <FormInput
            label="Confirm Password "
            variant="password"
            placeholder="••••••••••••"
            leadingIcon={<Lock className="w-5 h-5 text-neutral-grey3" />}
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />

          <div className="flex items-center text-sm">
            <input
              id="terms"
              type="checkbox"
              className="w-4 h-4 text-primary-brand rounded border-neutral-grey1 focus:ring-primary-brand"
              {...register("terms")}
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
            className="w-full max-w-sm h-12 text-lg font-semibold rounded-lg"
          >
            Sign up
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
    </div>
  );
};

export default RegisterPage;
