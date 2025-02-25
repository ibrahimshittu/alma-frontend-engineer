import React from "react";
import Login from "./component/login-index";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function LoginRoute() {
  const cookieStore = await cookies();

  if (cookieStore.get("token")) {
    return redirect("/admin/leads");
  }

  return <Login />;
}

export default LoginRoute;
