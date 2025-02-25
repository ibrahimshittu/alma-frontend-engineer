import React from "react";
import Leads from "./component/leads-index";
import { getAllLeads } from "../actions";

async function page() {
  const allLeads = await getAllLeads();

  return <Leads allLeads={allLeads} />;
}

export default page;
