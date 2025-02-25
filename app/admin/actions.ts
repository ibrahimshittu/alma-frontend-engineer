"use server";
import { Lead, updateLeadStatus } from "@/schemas/types";
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

export async function updateLead(
  prevState: updateLeadStatus,
  formData: FormData | null
): Promise<Lead | updateLeadStatus> {
  if (!formData) return prevState;

  const cookieStore = await cookies();
  const access_token = cookieStore.get("token");

  const body = {
    id: formData.get("id") as string,
    status: formData.get("status") as string,
    ...Object.fromEntries(formData),
  };

  const response = await fetch(`${BASE_URL}/api/lead/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    return { ...prevState };
  }

  const data = await response.json();

  return data.lead;
}
