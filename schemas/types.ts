export type Lead = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  portfolio: string;
  visaCategories: string[];
  message: string;
  status: "PENDING" | "REACHED_OUT";
  cv?: string;
  createdAt: string;
};

export type Admin = {
  id: number;
  email: string;
  password: string;
};

export type updateLeadStatus = Pick<Lead, "id" | "status">;
