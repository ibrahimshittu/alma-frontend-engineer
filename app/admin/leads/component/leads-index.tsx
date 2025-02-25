"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  MoreHorizontal,
} from "lucide-react";
import AlmaLogo from "@/components/icon/icon";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lead, updateLeadStatus } from "@/schemas/types";
import dayjs from "dayjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateLead } from "../../actions";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 15;

export default function LeadsPage({ allLeads }: { allLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(allLeads);
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
      const updatedLeads = leads.map((lead) => {
        if (lead.id === updateLeadState.id) {
          return { ...lead, status: "REACHED_OUT" as "REACHED_OUT" };
        }
        return lead;
      });
      setLeads(updatedLeads);

      toast.success("Lead status updated successfully");
      return;
    }

    toast.error("Failed to update lead status");
  }, [updateLeadState]);

  return (
    <div className="relative flex min-h-screen bg-white">
      <div className="absolute -top-40 -left-64 w-2/5 h-2/5 rounded-full bg-gradient-to-br from-[#c4cd73] to-[#fff] blur-3xl opacity-90 pointer-events-none" />

      {/* SIDEBAR */}
      <aside className="flex flex-col py-4 w-64 border-r border-gray-200 z-10">
        <div className="h-16 flex items-center px-6">
          <AlmaLogo className="bg-[transparent] w-20 h-20" />
        </div>

        <nav className="flex-1 px-2 py-14 space-y-2">
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

        <div className="px-6 py-4 flex items-center space-x-4">
          <div className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full text-lg font-semibold">
            A
          </div>
          <p className="text-sm font-bold text-gray-600">Admin</p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 py-9 px-6 z-10">
        <h1 className="text-2xl font-bold mb-8">Leads</h1>

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

        {/* LEADS TABLE */}
        <div className="border rounded-xl overflow-hidden">
          <ScrollArea className="h-[calc(100vh-17rem)]">
            <Table className="w-full">
              <TableHeader className="sticky top-0">
                <TableRow className="h-12 bg-white">
                  <TableHead
                    onClick={() => handleSort("firstName")}
                    className="cursor-pointer select-none pl-4"
                  >
                    Name {renderSortIcon("firstName")}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("createdAt")}
                    className="cursor-pointer select-none"
                  >
                    Submitted {renderSortIcon("createdAt")}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("status")}
                    className="cursor-pointer select-none"
                  >
                    Status {renderSortIcon("status")}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("country")}
                    className="cursor-pointer select-none"
                  >
                    Country {renderSortIcon("country")}
                  </TableHead>
                  <TableHead className="select-none"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedLeads.map((lead, idx) => (
                  <TableRow key={idx} className="h-14">
                    <TableCell className="pl-4">
                      {lead.firstName} {lead.lastName}
                    </TableCell>
                    <TableCell>
                      {dayjs(lead.createdAt).format("MM/DD/YYYY, hh:mm A")}
                    </TableCell>
                    <TableCell>
                      {lead.status
                        .replace(/_/g, " ")
                        .toLowerCase()
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </TableCell>
                    <TableCell>{lead.country}</TableCell>
                    <TableCell className="flex items-center justify-start pr-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          disabled={lead.status === "REACHED_OUT"}
                        >
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              const formData = new FormData();
                              formData.append("id", lead.id);
                              formData.append("status", "REACHED_OUT");
                              startTransition(() => {
                                updateLeadAction(formData);
                              });
                            }}
                          >
                            Update Status
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedLeads.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No leads found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
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
