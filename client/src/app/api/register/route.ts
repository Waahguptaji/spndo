// src/app/api/register/route.js
import { NextResponse } from 'next/server';
import { addUser } from '@/components/lib/mockDb'; // Adjust the import path as needed

export async function POST(req: { json: () => PromiseLike<{ email: any; password: any; }> | { email: any; password: any; }; }) {
  try {
    // This is the correct way to parse the JSON body in the App Router
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Missing email or password.'
      }, { status: 400 });
    }

    const user = addUser(email, password);

    if (user) {
      return NextResponse.json({
        success: true,
        user: { id: user.id, email: user.email }
      }, { status: 201 });
    } else {
      return NextResponse.json({
        success: false,
        message: 'User with this email already exists.'
      }, { status: 409 });
    }
  } catch (error) {
    // This catch block handles cases where the request body is not valid JSON.
    console.error("Error parsing request body:", error);
    return NextResponse.json({
      success: false,
      message: 'Invalid request body.'
    }, { status: 400 });
  }
}