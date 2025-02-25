import { Lead } from "@/schemas/types";
import fs from "fs/promises";
import path from "path";

const leadsFilePath = path.join(process.cwd(), "db", "lead.json");

export async function ensureDirExists(dir: string) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

export async function readLeads(): Promise<Lead[]> {
  try {
    const data = await fs.readFile(leadsFilePath, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function saveLeads(leads: Lead[]): Promise<void> {
  await fs.writeFile(leadsFilePath, JSON.stringify(leads, null, 2));
}

export function getFieldValue(field: string | string[] | undefined): string {
  if (Array.isArray(field)) {
    return field[0];
  }
  return field || "";
}
