import React from "react";
import Leads from "./component/leads-index";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAllLeads } from "../actions";

async function page() {
  const cookieStore = await cookies();

  if (!cookieStore.get("token")) {
    return redirect("/admin/login");
  }

  const allLeads = await getAllLeads();

  return <Leads allLeads={allLeads} />;
}

export default page;
