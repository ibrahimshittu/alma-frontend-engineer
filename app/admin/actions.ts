"use server";
import { Lead } from "@/schemas/types";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

export async function getAllLeads(): Promise<Lead[]> {
  const cookieStore = await cookies();
  const access_token = cookieStore.get("token");

  const response = await fetch(`${BASE_URL}/api/lead`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
  });

  console.log("response", response);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch leads");
  }

  const data = await response.json();
  console.log("data", data);
  return data.leads;
}
