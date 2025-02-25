import { create } from "zustand";
import { LeadsState } from "@/schemas/types";

export const useLeadStore = create<LeadsState>((set, get) => ({
  leads: [],
  setLeads: (leads) => set({ leads }),
  updateLeadStatus: (id, status) =>
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead.id === id ? { ...lead, status } : lead
      ),
    })),
  initializeLeads: (initialLeads) => {
    if (get().leads.length === 0) {
      set({ leads: initialLeads });
    }
  },
}));
