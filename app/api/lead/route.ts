import { NextResponse } from "next/server";
import formidable, { File } from "formidable";
import fs from "fs/promises";
import path from "path";
import { readLeads, saveLeads, ensureDirExists } from "@/lib/helpers";
import { getFieldValue } from "@/lib/helpers";
import { Readable } from "stream";
import { IncomingMessage } from "http";
import { LeadData } from "@/schemas/types";
import jwt from "jsonwebtoken";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadsDir = path.join(process.cwd(), "public", "uploads");

export async function POST(request: Request) {
  try {
    await ensureDirExists(uploadsDir);

    const buffer = await request.arrayBuffer();
    const nodeReq = Readable.from(Buffer.from(buffer));

    (nodeReq as IncomingMessage).headers = Object.fromEntries(
      request.headers.entries()
    );

    const form = formidable({
      multiples: false,
      uploadDir: uploadsDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5 MB limit
    });

    const { fields, files } = await new Promise<{
      fields: formidable.Fields;
      files: formidable.Files;
    }>((resolve, reject) => {
      form.parse(
        nodeReq as unknown as IncomingMessage,
        (err, fields, files) => {
          if (err) return reject(err);
          resolve({ fields, files });
        }
      );
    });

    let visaCategories: string[] = [];
    const visaField = fields["visaCategories[]"];
    if (typeof visaField === "string") {
      visaCategories = [visaField];
    } else if (Array.isArray(visaField)) {
      visaCategories = visaField;
    }

    const newLead: LeadData = {
      firstName: getFieldValue(fields.firstName),
      lastName: getFieldValue(fields.lastName),
      email: getFieldValue(fields.email),
      country: getFieldValue(fields.country),
      portfolio: getFieldValue(fields.portfolio),
      visaCategories,
      message: getFieldValue(fields.message),
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };

    if (files.cv) {
      let file: File;
      if (Array.isArray(files.cv)) {
        file = files.cv[0];
      } else {
        file = files.cv;
      }

      const firstName = getFieldValue(fields.firstName);
      const lastName = getFieldValue(fields.lastName);
      const timestamp = Date.now();
      const ext = file.originalFilename
        ? path.extname(file.originalFilename)
        : "";
      const newFileName = `${firstName}_${lastName}_${timestamp}${ext}`;
      const newPath = path.join(uploadsDir, newFileName);

      try {
        await fs.rename(file.filepath, newPath);
      } catch (renameErr) {
        console.error("Error renaming file:", renameErr);
        return NextResponse.json(
          { message: "Error saving uploaded file" },
          { status: 500 }
        );
      }
      newLead.cv = `/uploads/${newFileName}`;
    }

    let leads: LeadData[] = await readLeads();
    leads.push(newLead);
    await saveLeads(leads);

    return NextResponse.json(
      { message: "Lead saved successfully", lead: newLead },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error handling lead submission:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Unauthorized: kindly login to access this resource" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET || "MY_SUPER_SECRET";

  try {
    jwt.verify(token, secret);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Unauthorized: Invalid credentials",
        error: (error as Error).message,
      },
      { status: 401 }
    );
  }

  try {
    const leads: LeadData[] = await readLeads();
    return NextResponse.json({ message: "Success", leads }, { status: 200 });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
