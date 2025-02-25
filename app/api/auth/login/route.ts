import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import users from "@/db/users.json";

interface User {
  id: number;
  email: string;
  password: string;
}

export async function POST(request: Request): Promise<Response> {
  try {
    // Parse the incoming JSON body
    const { email, password } = (await request.json()) as {
      email: string;
      password: string;
    };

    // Find the user in the mock database
    const user = (users as User[]).find((u) => u.email === email);
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate a JWT token (replace 'MY_SUPER_SECRET' with your secret or use process.env.JWT_SECRET)
    const token = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET || "MY_SUPER_SECRET",
      { expiresIn: "1h" }
    );

    return NextResponse.json(
      { token, message: "Login successful" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
