import { NextResponse } from "next/server";
import formidable, { File } from "formidable";
import fs from "fs/promises";
import path from "path";
import { readLeads, saveLeads, ensureDirExists } from "@/lib/helpers";
import { getFieldValue } from "@/lib/helpers";
import { Readable } from "stream";
import { IncomingMessage } from "http";
import { Lead } from "@/schemas/types";
import { verifyAuthToken } from "@/lib/auth";

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

    const newLead: Lead = {
      id: Math.random().toString(36).slice(2, 11),
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
        return NextResponse.json(
          { message: `Error saving uploaded file: ${renameErr}` },
          { status: 500 }
        );
      }
      newLead.cv = `/uploads/${newFileName}`;
    }

    let leads: Lead[] = await readLeads();
    leads.push(newLead);
    await saveLeads(leads);

    return NextResponse.json(
      { message: "Lead saved successfully", lead: newLead },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    verifyAuthToken(request);
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 401 }
    );
  }

  try {
    const leads: Lead[] = await readLeads();
    return NextResponse.json({ message: "Success", leads }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request): Promise<NextResponse> {
  try {
    verifyAuthToken(request);
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 401 }
    );
  }

  let body: Partial<Lead> & { id: string };
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.id) {
    return NextResponse.json({ message: "Missing lead id" }, { status: 400 });
  }

  try {
    const leads: Lead[] = await readLeads();
    const index = leads.findIndex((lead) => lead.id === body.id);
    if (index === -1) {
      return NextResponse.json({ message: "Lead not found" }, { status: 404 });
    }

    const updatedLead: Lead = { ...leads[index], ...body };
    leads[index] = updatedLead;
    await saveLeads(leads);

    return NextResponse.json(
      { message: "Lead updated successfully", lead: updatedLead },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
