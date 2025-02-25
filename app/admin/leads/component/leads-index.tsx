"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Search,
  ChevronRight,
  ChevronLeft,
  X,
  Logs,
} from "lucide-react";
import AlmaLogo from "@/components/icon/icon";
import { usePathname } from "next/navigation";
import { Lead, updateLeadStatus } from "@/schemas/types";
import { updateLead } from "../../actions";
import { toast } from "sonner";
import LeadsTable from "./leads-table";
import dayjs from "dayjs";
import { useLeadStore } from "@/store/lead-store";

const ITEMS_PER_PAGE = 25;

export default function LeadsPage({ allLeads }: { allLeads: Lead[] }) {
  const { leads, updateLeadStatus, initializeLeads } = useLeadStore();

  initializeLeads(allLeads);

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pathname = usePathname();

  const [sorting, setSorting] = useState<{
    column: keyof Lead | null;
    direction: "asc" | "desc";
  }>({
    column: null,
    direction: "asc",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const initialstate: updateLeadStatus = {
    id: "",
    status: "PENDING",
  };

  const [updateLeadState, updateLeadAction] = useActionState(
    updateLead,
    initialstate
  );

  function handleSort(column: keyof Lead) {
    let direction: "asc" | "desc" = "asc";

    if (sorting.column === column && sorting.direction === "asc") {
      direction = "desc";
    }

    setSorting({ column, direction });
  }

  const displayedLeads = [...leads]
    .filter((lead) => {
      if (
        statusFilter &&
        statusFilter !== "All" &&
        lead.status !== statusFilter
      )
        return false;
      return true;
    })
    .filter((lead) => {
      if (!searchTerm) return true;
      const lower = searchTerm.toLowerCase();
      return (
        lead.firstName.toLowerCase().includes(lower) ||
        lead.country.toLowerCase().includes(lower) ||
        lead.status.toLowerCase().includes(lower)
      );
    })
    .sort((a, b) => {
      if (!sorting.column) return 0;

      let valA = a[sorting.column] as string | number;
      let valB = b[sorting.column] as string | number;

      if (sorting.column === "createdAt") {
        valA = dayjs(valA).unix();
        valB = dayjs(valB).unix();
      } else {
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
      }

      if (!valA) return 1;
      if (!valB) return -1;
      if (valA < valB) return sorting.direction === "asc" ? -1 : 1;
      if (valA > valB) return sorting.direction === "asc" ? 1 : -1;
      return 0;
    });

  function renderSortIcon(column: keyof Lead) {
    if (sorting.column !== column) {
      return (
        <ArrowUpDown className="inline-block w-4 h-4 ml-1 text-gray-400" />
      );
    }
    return sorting.direction === "asc" ? (
      <ArrowUp className="inline-block w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="inline-block w-4 h-4 ml-1" />
    );
  }

  const totalItems = displayedLeads.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const pageStart = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageEnd = pageStart + ITEMS_PER_PAGE;
  const paginatedLeads = displayedLeads.slice(pageStart, pageEnd);

  useEffect(() => {
    if (updateLeadState.status === "REACHED_OUT") {
      updateLeadStatus(updateLeadState.id, "REACHED_OUT");

      toast.success("Lead status updated successfully");
      return;
    } else if (updateLeadState.status === "PENDING" && updateLeadState.id) {
      toast.error("Failed to update lead status");
    }
  }, [updateLeadState]);

  return (
    <div className="relative flex min-h-screen bg-white">
      <div className="absolute -top-40 -left-64 w-2/5 h-2/5 rounded-full bg-gradient-to-br from-[#c4cd73] to-[#fff] blur-3xl opacity-90 pointer-events-none" />

      {/* SIDEBAR */}
      <aside
        className={`flex fixed inset-y-0 left-0 w-64 bg-white lg:bg-transparent border-r border-gray-200 p-4 z-50 lg:static lg:flex flex-col 
          transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          transition-transform ease-in-out duration-300 lg:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-2">
          <AlmaLogo className="w-20 h-20" />
          <Button
            variant="default"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <nav className="flex-1 py-14 space-y-2">
          <Link
            href="/admin/leads"
            className={`block rounded-md px-3 py-2 text-base ${
              pathname === "/admin/leads"
                ? "font-bold text-gray-900"
                : "font-medium text-gray-700"
            }`}
          >
            Leads
          </Link>
          <Link
            href="#"
            className={`block rounded-md px-3 py-2 text-base  ${
              pathname === "/settings"
                ? "font-bold  text-gray-900"
                : "font-medium text-gray-700"
            }`}
          >
            Settings
          </Link>
        </nav>

        <div className="py-4 flex items-center space-x-4">
          <div className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full text-lg font-semibold">
            A
          </div>
          <p className="text-sm font-bold text-gray-600">Admin</p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 py-9 px-6 z-10">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-bold mb-8">Leads</h1>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            <Logs className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="relative max-w-xs w-full">
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full h-10 rounded-lg"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <Select
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val)}
          >
            <SelectTrigger className="w-[180px] h-10 rounded-lg">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="REACHED_OUT">Reached Out</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-xl overflow-hidden">
          <LeadsTable
            paginatedLeads={paginatedLeads}
            updateLeadAction={updateLeadAction}
            renderSortIcon={renderSortIcon}
            handleSort={handleSort}
          />

          {/* PAGINATION */}
          <div className="flex items-center justify-end space-x-2 px-4 py-4 border-t border-gray-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              const isActive = page === currentPage;
              return (
                <Button
                  key={page}
                  size="sm"
                  className={`shadow-none text-black ${
                    isActive
                      ? "border border-black bg-transparent hover:text-white hover:bg-black"
                      : "bg-white border-none hover:bg-gray-100"
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
