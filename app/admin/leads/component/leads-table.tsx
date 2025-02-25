"use client";

import { JSX, startTransition } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import dayjs from "dayjs";
import { Lead } from "@/schemas/types";

export default function LeadsTable({
  paginatedLeads,
  handleSort,
  renderSortIcon,
  updateLeadAction,
}: {
  paginatedLeads: Lead[];
  handleSort: (column: keyof Lead) => void;
  renderSortIcon: (column: keyof Lead) => JSX.Element;
  updateLeadAction: (formData: FormData) => void;
}) {
  return (
    <ScrollArea className="lg:h-[calc(100vh-17rem)] h-[calc(100vh-10rem)]">
      <Table className="w-full">
        <TableHeader className="sticky top-0  bg-white z-10">
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
  );
}
