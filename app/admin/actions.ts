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

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch leads");
  }

  const data = await response.json();
  return data.leads;
}

export async function updateLead(lead: Lead): Promise<Lead> {
  const cookieStore = await cookies();
  const access_token = cookieStore.get("token");

  const response = await fetch(`${BASE_URL}/api/lead/${lead.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
    body: JSON.stringify(lead),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update lead");
  }

  const data = await response.json();
  return data.lead;
}
