"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  assessmentFormSchema,
  AssessmentFormData,
} from "../../schemas/formSchema";
import AlmaLogo from "@/components/icon/icon";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import countries from "../../db/country.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentFormSchema),
  });

  const onSubmit = async (data: AssessmentFormData) => {
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // Handle server-side validation or errors
        const errorData = await response.json();
        console.error(errorData);
        return;
      }

      // If successful, go to thank-you page
      // router.push("/thank-you");
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  const form = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      country: "",
      portfolio: "",
      visaCategories: [],
      message: "",
    },
  });

  const availableVisaCategories = ["O1", "EB1-A", "EB2-NIW", "I don't know"];

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#d8dea6] py-32 text-center relative overflow-hidden">
        <div className="absolute top-[-5rem] left-[-24rem] w-full h-full">
          <Image
            src="/home/bg-icon.webp"
            width={680}
            height={108}
            objectPosition="center"
            alt=""
          />
        </div>

        <div className="max-w-3xl mx-auto flex flex-col items-start justify-start space-y-2 pl-6">
          <AlmaLogo className="bg-[#d8dea6] w-20 h-20" />

          <h1 className="text-6xl font-extrabold text-[#010000] text-left">
            <span className="block">Get An Assessment</span>
            Of Your Immigration Case
          </h1>
        </div>
      </header>

      <main className="mx-auto py-6 mt-8 max-w-xl px-4">
        <div className="text-center mb-16">
          <div className="mx-auto w-full flex justify-center">
            <Image
              src="/home/info-icon.png"
              objectFit="cover"
              width={90}
              height={18}
              objectPosition="center"
              alt=""
            />
          </div>

          <h2 className="mb-4 text-xl font-bold text-[#010000]">
            Want to understand your visa options?
          </h2>
          <p className=" text-[#010000] font-bold text-base">
            Submit the form below and our experienced attorneys will <br />{" "}
            review your information and send a preliminary assessment of your
            case based on your goals.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 max-w-sm mx-auto"
          >
            {/* Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="LastName" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Country of Citizenship" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.name}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="portfolio"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="LinkedIn/Personal website URL"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Visa Categories (Multiple Checkboxes) */}
            <FormField
              control={form.control}
              name="visaCategories"
              render={({ field }) => (
                <FormItem className="pt-12 w-full text-center">
                  <div className="mx-auto w-full flex justify-center">
                    <Image
                      src="/home/dice-icon.png"
                      objectFit="cover"
                      width={90}
                      height={18}
                      objectPosition="center"
                      alt=""
                    />
                  </div>
                  <FormLabel className="text-xl font-bold text-[#010000] text-center w-full">
                    Visa Categories of Interest?
                  </FormLabel>

                  <div className="mt-3 space-y-2">
                    {availableVisaCategories.map((category) => {
                      const checked = field.value.includes(category);
                      return (
                        <FormItem
                          key={category}
                          className="flex items-center space-x-2"
                        >
                          <FormControl>
                            <Checkbox
                              checked={checked}
                              // `onCheckedChange` can be true/false, so we handle both
                              onCheckedChange={(isChecked) => {
                                if (isChecked) {
                                  field.onChange([...field.value, category]);
                                } else {
                                  field.onChange(
                                    field.value.filter((v) => v !== category)
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal pb-2">
                            {category}
                          </FormLabel>
                        </FormItem>
                      );
                    })}
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="py-12 w-full text-center">
                  <div className="mx-auto w-full flex justify-center">
                    <Image
                      src="/home/heart-icon.png"
                      objectFit="cover"
                      width={90}
                      height={18}
                      objectPosition="center"
                      alt=""
                    />
                  </div>
                  <FormLabel className="text-xl font-bold text-[#010000] text-center w-full">
                    How can we help you?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What is your current status and when does it expire? What is your past immigration history? Are you looking for long-term permanent residency or short-term employment visa or both? Are there any timeline considerations?"
                      {...field}
                      rows={8}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </main>
    </div>
  );
}
