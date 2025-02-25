"use client";

import { useState } from "react";
import Link from "next/link";

// shadcn/ui components
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
import { Separator } from "@/components/ui/separator";

// Icons from lucide-react (or any icon library)
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Search,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import AlmaLogo from "@/components/icon/icon";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define our Lead type
interface Lead {
  name: string;
  submitted: string; // e.g. "02/02/2024, 2:45 PM"
  status: string;
  country: string;
}

// Initial leads data
const initialLeads: Lead[] = [
  {
    name: "Jorge Ruiz",
    submitted: "02/02/2024, 2:45 PM",
    status: "Pending",
    country: "Mexico",
  },
  {
    name: "Bahar Zamir",
    submitted: "02/02/2024, 2:45 PM",
    status: "Pending",
    country: "Mexico",
  },
  {
    name: "Mary Lopez",
    submitted: "02/02/2024, 2:45 PM",
    status: "Pending",
    country: "Brazil",
  },
  {
    name: "Li Zijin",
    submitted: "02/02/2024, 2:45 PM",
    status: "Pending",
    country: "South Korea",
  },
  {
    name: "Mark Antonov",
    submitted: "02/02/2024, 2:45 PM",
    status: "Pending",
    country: "Russia",
  },
  {
    name: "Jane Ma",
    submitted: "02/02/2024, 2:45 PM",
    status: "Pending",
    country: "Mexico",
  },
  {
    name: "Anand Jain",
    submitted: "02/02/2024, 2:45 PM",
    status: "Reached Out",
    country: "Mexico",
  },
  {
    name: "Anna Voronova",
    submitted: "02/02/2024, 2:45 PM",
    status: "Pending",
    country: "France",
  },
  {
    name: "Anand Jain",
    submitted: "02/02/2024, 2:45 PM",
    status: "Reached Out",
    country: "Mexico",
  },
  {
    name: "Anna Voronova",
    submitted: "02/02/2024, 2:45 PM",
    status: "Pending",
    country: "France",
  },
  {
    name: "Anand Jain",
    submitted: "02/02/2024, 2:45 PM",
    status: "Reached Out",
    country: "Mexico",
  },
  {
    name: "Anna Voronova",
    submitted: "02/02/2024, 2:45 PM",
    status: "Pending",
    country: "France",
  },
  {
    name: "Anand Jain",
    submitted: "02/02/2024, 2:45 PM",
    status: "Reached Out",
    country: "Mexico",
  },
  {
    name: "Anna Voronova",
    submitted: "02/02/2024, 2:45 PM",
    status: "Pending",
    country: "France",
  },
  {
    name: "Anand Jain",
    submitted: "02/02/2024, 2:45 PM",
    status: "Reached Out",
    country: "Mexico",
  },
  {
    name: "Anna Voronova",
    submitted: "02/02/2024, 2:45 PM",
    status: "Pending",
    country: "France",
  },
  {
    name: "Anand Jain",
    submitted: "02/02/2024, 2:45 PM",
    status: "Reached Out",
    country: "Mexico",
  },
  {
    name: "Anna Voronova",
    submitted: "02/02/2024, 2:45 PM",
    status: "Pending",
    country: "France",
  },
  {
    name: "Anand Jain",
    submitted: "02/02/2024, 2:45 PM",
    status: "Reached Out",
    country: "Mexico",
  },
  {
    name: "Anna Voronova",
    submitted: "02/02/2024, 2:45 PM",
    status: "Pending",
    country: "France",
  },
  {
    name: "Anand Jain",
    submitted: "02/02/2024, 2:45 PM",
    status: "Reached Out",
    country: "Mexico",
  },
  {
    name: "Anna Voronova",
    submitted: "02/02/2024, 2:45 PM",
    status: "Pending",
    country: "France",
  },
  {
    name: "Anand Jain",
    submitted: "02/02/2024, 2:45 PM",
    status: "Reached Out",
    country: "Mexico",
  },
  {
    name: "Anna Voronova",
    submitted: "02/02/2024, 2:45 PM",
    status: "Pending",
    country: "France",
  },
  {
    name: "Anand Jain",
    submitted: "02/02/2024, 2:45 PM",
    status: "Reached Out",
    country: "Mexico",
  },
  {
    name: "Anna Voronova",
    submitted: "02/02/2024, 2:45 PM",
    status: "Pending",
    country: "France",
  },
  {
    name: "Anand Jain",
    submitted: "02/02/2024, 2:45 PM",
    status: "Reached Out",
    country: "Mexico",
  },
  {
    name: "Anna Voronova",
    submitted: "02/02/2024, 2:45 PM",
    status: "Pending",
    country: "France",
  },
  {
    name: "Anand Jain",
    submitted: "02/02/2024, 2:45 PM",
    status: "Reached Out",
    country: "Mexico",
  },
  {
    name: "Anna Voronova",
    submitted: "02/02/2024, 2:45 PM",
    status: "Pending",
    country: "France",
  },
  {
    name: "Anand Jain",
    submitted: "02/02/2024, 2:45 PM",
    status: "Reached Out",
    country: "Mexico",
  },
  {
    name: "Anna Voronova",
    submitted: "02/02/2024, 2:45 PM",
    status: "Pending",
    country: "France",
  },
  {
    name: "Anand Jain",
    submitted: "02/02/2024, 2:45 PM",
    status: "Reached Out",
    country: "Mexico",
  },
  {
    name: "Anna Voronova",
    submitted: "02/02/2024, 2:45 PM",
    status: "Pending",
    country: "France",
  },
];

// Helper to parse date/time strings like "MM/DD/YYYY, HH:MM AM/PM" into a numeric value for sorting
function parseDateString(dateStr: string): number {
  // e.g., "02/02/2024, 2:45 PM" => new Date("02/02/2024 2:45 PM").getTime()
  const [datePart, timePart] = dateStr.split(",");
  return new Date(`${datePart.trim()} ${timePart.trim()}`).getTime();
}

export default function LeadsPage() {
  const pathname = usePathname();

  const [leads] = useState<Lead[]>(initialLeads);

  // Sorting state: which column & direction
  const [sorting, setSorting] = useState<{
    column: keyof Lead | null;
    direction: "asc" | "desc";
  }>({
    column: null,
    direction: "asc",
  });

  // Search & status filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  /**
   * Handle sorting when a column header is clicked
   * - Toggles between ascending/descending if the same column is clicked again.
   */
  function handleSort(column: keyof Lead) {
    let direction: "asc" | "desc" = "asc";

    // If same column is clicked, toggle direction
    if (sorting.column === column && sorting.direction === "asc") {
      direction = "desc";
    }

    setSorting({ column, direction });
  }

  /**
   * Derive the final array of leads to display:
   * 1. Filter by status
   * 2. Filter by search term (name, country, status)
   * 3. Sort by the active column/direction
   */
  const displayedLeads = [...leads]
    // 1. Filter by status
    .filter((lead) => {
      // If the status filter is not "all" and the lead's status doesn't match, filter it out.
      if (
        statusFilter &&
        statusFilter !== "All" &&
        lead.status !== statusFilter
      )
        return false;
      return true;
    })
    // 2. Filter by search term (case-insensitive, matching name/country/status)
    .filter((lead) => {
      if (!searchTerm) return true;
      const lower = searchTerm.toLowerCase();
      return (
        lead.name.toLowerCase().includes(lower) ||
        lead.country.toLowerCase().includes(lower) ||
        lead.status.toLowerCase().includes(lower)
      );
    })
    // 3. Sort by column if specified
    .sort((a, b) => {
      if (!sorting.column) return 0; // no sorting active

      let valA: string | number = a[sorting.column];
      let valB: string | number = b[sorting.column];

      // For date/time in "submitted" column
      if (sorting.column === "submitted") {
        valA = parseDateString(valA as string);
        valB = parseDateString(valB as string);
      } else {
        // For string columns, compare case-insensitively
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
      }

      if (valA < valB) return sorting.direction === "asc" ? -1 : 1;
      if (valA > valB) return sorting.direction === "asc" ? 1 : -1;
      return 0;
    });

  /**
   * Render the sorting icon for a given column.
   * - Always visible: default to ArrowUpDown if not sorting that column.
   * - Show ArrowUp or ArrowDown if it is the active sorting column.
   */
  function renderSortIcon(column: keyof Lead) {
    if (sorting.column !== column) {
      // Not sorting by this column => show neutral up/down icon
      return (
        <ArrowUpDown className="inline-block w-4 h-4 ml-1 text-gray-400" />
      );
    }
    // Sorting this column => show direction
    return sorting.direction === "asc" ? (
      <ArrowUp className="inline-block w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="inline-block w-4 h-4 ml-1" />
    );
  }

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const totalItems = displayedLeads.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Ensure currentPage is not out of range (e.g., after filtering)
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  // Calculate the leads to show on the current page
  const pageStart = (currentPage - 1) * itemsPerPage;
  const pageEnd = pageStart + itemsPerPage;
  const paginatedLeads = displayedLeads.slice(pageStart, pageEnd);

  function renderPagination() {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentPage((p) => p - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <Button
              key={page}
              size="sm"
              className={
                isActive
                  ? "border shadow-none border-black bg-transparent text-black hover:text-white hover:bg-black"
                  : "bg-white text-black border-none hover:bg-gray-100 shadow-none"
              }
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
    );
  }

  return (
    <div className="relative flex min-h-screen bg-white">
      <div className="absolute -top-40 -left-64 w-2/5 h-2/5 rounded-full bg-gradient-to-br from-[#c4cd73] to-[#fff] blur-3xl opacity-90 pointer-events-none" />

      {/* SIDEBAR */}
      <aside className="flex flex-col py-4 w-64 border-r border-gray-200 z-10">
        <div className="h-16 flex items-center px-6">
          <AlmaLogo className="bg-[transparent] w-20 h-20" />
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-2 py-14 space-y-2">
          <Link
            href="/leads"
            className={`block rounded-md px-3 py-2 text-base ${
              pathname === "/leads"
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

        {/* Bottom Section (Admin) */}
        <div className="px-6 py-4 flex items-center space-x-4">
          <div className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full text-lg font-semibold">
            {"A"}
            {""}
          </div>
          <p className="text-sm font-bold text-gray-600">Admin</p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 py-9 px-6 z-10">
        <h1 className="text-2xl font-bold mb-8">Leads</h1>

        {/* Search & Filter Bar */}
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

          {/* Status Filter (Select) */}
          <Select
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val)}
          >
            <SelectTrigger className="w-[180px] h-10 rounded-lg">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Reached Out">Reached Out</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* LEADS TABLE */}
        <div className="border rounded-xl overflow-hidden">
          <ScrollArea className="h-[570px]">
            <Table className="w-full">
              <TableHeader className="sticky top-0 bg-white">
                <TableRow className="h-12 ">
                  <TableHead
                    onClick={() => handleSort("name")}
                    className="cursor-pointer select-none pl-4"
                  >
                    Name {renderSortIcon("name")}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("submitted")}
                    className="cursor-pointer select-none"
                  >
                    Submitted {renderSortIcon("submitted")}
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
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedLeads.map((lead, idx) => (
                  <TableRow key={idx} className="h-14">
                    <TableCell className="pl-4">{lead.name}</TableCell>
                    <TableCell>{lead.submitted}</TableCell>
                    <TableCell>{lead.status}</TableCell>
                    <TableCell>{lead.country}</TableCell>
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
          <div className="px-4 py-4 border-t border-gray-200">
            {renderPagination()}
          </div>
        </div>
      </main>
    </div>
  );
}
