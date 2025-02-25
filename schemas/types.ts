export type LeadData = {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  portfolio: string;
  visaCategories: string[];
  message: string;
  status?: "PENDING" | "REACHED_OUT";
  cv?: string;
  createdAt: string;
};
