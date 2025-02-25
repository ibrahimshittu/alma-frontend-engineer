import { NextResponse } from "next/server";
import formidable, { File } from "formidable";
import fs from "fs/promises";
import path from "path";
import { ensureDirExists, readLeads, saveLeads } from "@/lib/helpers";
import { getFieldValue } from "@/lib/helpers";
import { LeadData } from "@/schemas/types";
import { IncomingMessage } from "http";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadsDir = path.join(process.cwd(), "public", "uploads");

export async function POST(request: Request) {
  try {
    await ensureDirExists(uploadsDir);

    const form = formidable({
      multiples: false,
      uploadDir: uploadsDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
    });

    const { fields, files } = await new Promise<{
      fields: formidable.Fields;
      files: formidable.Files;
    }>((resolve, reject) => {
      const req = request as unknown as IncomingMessage;
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    let visaCategories: string[] = [];
    const visaField = fields["visaCategories[]"];
    console.log("visaField", visaField);
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

    console.log("New lead saved:", newLead);

    return NextResponse.json(
      { message: "Lead saved successfully", lead: newLead },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling lead submission:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
