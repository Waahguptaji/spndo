// src/app/api/login/route.ts
import { NextResponse } from "next/server";
import { findUserByEmail } from "@/components/lib/mockDb";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing email or password.", data: null },
        { status: 400 }
      );
    }

    const user = findUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found.", data: null },
        { status: 404 }
      );
    }

    if (user.password !== password) {
      return NextResponse.json(
        { success: false, message: "Invalid password.", data: null },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        data: { id: user.id, email: user.email },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error parsing login body:", error);
    return NextResponse.json(
      { success: false, message: "Invalid request body.", data: null },
      { status: 400 }
    );
  }
}
