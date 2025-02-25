import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import ThankYou from "../component/thank-you-index";

async function ThankYouRoute() {
  const cookie = await cookies();

  const formSubmitted = cookie.get("formSubmitted");

  if (!formSubmitted) {
    redirect("/");
  }

  return <ThankYou />;
}

export default ThankYouRoute;
