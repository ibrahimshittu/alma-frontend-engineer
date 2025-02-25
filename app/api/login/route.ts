import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import admins from "@/db/admin.json";
import { Admin } from "@/schemas/types";
import { verifyAuthToken } from "@/lib/auth";

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
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error: error },
      { status: 500 }
    );
  }
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    verifyAuthToken(request);
    return NextResponse.json({ message: "Token is valid" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 401 }
    );
  }
}
