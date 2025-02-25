import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import admins from "@/db/admin.json";
import { Admin } from "@/schemas/types";

const SECRET_KEY = process.env.JWT_SECRET || "";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { email, password } = (await request.json()) as {
      email: string;
      password: string;
    };

    const admin = (admins as Admin[]).find((u) => u.email === email);
    if (!admin) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log("admin found:", admin);

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = jwt.sign({ sub: admin.id, email: admin.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    const res = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    );
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60,
    });

    return res;
  } catch (error: any) {
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
