import React from "react";
import Leads from "./component/leads-index";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function page() {
  const cookieStore = await cookies();

  if (!cookieStore.get("token")) {
    return redirect("/admin/login");
  }
  return <Leads />;
}

export default page;
