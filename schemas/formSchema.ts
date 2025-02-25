import { z } from "zod";

export const assessmentFormSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().email("Email address must be valid"),
  portfolio: z.string().url("LinkedIn/Personal Website URL is required"),
  country: z.string().min(1, "Country of Citizenship is required"),
  visaCategories: z
    .array(z.string())
    .min(1, "Select at least one visa category"),
  message: z
    .string()
    .min(
      1,
      "It is important to provide more information about your situation and what you are looking for"
    ),
});

export type AssessmentFormData = z.infer<typeof assessmentFormSchema>;
