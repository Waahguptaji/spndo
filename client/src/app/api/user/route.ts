// src/app/api/user/route.ts
import { NextResponse } from "next/server";
import { findUserById, findUserByEmail, updateUser } from "@/components/lib/mockDb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const email = searchParams.get("email");

  let user = null;
  if (id) {
    user = findUserById(id);
  } else if (email) {
    user = findUserByEmail(email);
  }

  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found.", data: null },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: "User fetched successfully.",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        pinCode: user.pinCode,
        image: user.image, // ✅ return stored image
      },
    },
    { status: 200 }
  );
}

export async function PUT(req: Request) {
  try {
    const { id, name, phone, address, city, state, pinCode, image } = await req.json();
    if (!id) {
      return NextResponse.json(
        { success: false, message: "User ID is required.", data: null },
        { status: 400 }
      );
    }

    const updated = updateUser(id, { name, phone, address, city, state, pinCode, image });
    if (!updated) {
      return NextResponse.json(
        { success: false, message: "User not found.", data: null },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User updated successfully.",
        data: {
          id: updated.id,
          email: updated.email,
          name: updated.name,
          phone: updated.phone,
          address: updated.address,
          city: updated.city,
          state: updated.state,
          pinCode: updated.pinCode,
          image: updated.image, // ✅ return saved image
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Update error:", err);
    return NextResponse.json(
      { success: false, message: "Invalid request body.", data: null },
      { status: 400 }
    );
  }
}
