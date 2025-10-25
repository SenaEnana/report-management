"use client";

import { useEffect, useState } from "react";
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type ReportRow = {
  branch_name: string;
  terminal_id: string;
  cash_advance_amount: number;
  visa_txn: number;
  visa_dollar: string;
  mc_dollar: string;
  district: string;
  cup_dollar: number;
  total_amount: number;
  grand_total: number;
  mc_amount: number;
  cup_amount: number;
};

const columnsConfig: {
  accessorKey: keyof ReportRow;
  title: string;
}[] = [
  { accessorKey: "branch_name", title: "Branch" },
  { accessorKey: "terminal_id", title: "Terminal ID" },
  { accessorKey: "cash_advance_amount", title: "CA Amount" },
  { accessorKey: "visa_txn", title: "VISA Txns" },
  { accessorKey: "visa_dollar", title: "VISA $ (USD)" },
  { accessorKey: "district", title: "District" },
  { accessorKey: "mc_amount", title: "MC Amount" },
  { accessorKey: "mc_dollar", title: "MC $" },
  { accessorKey: "cup_amount", title: "China Amount" },
  { accessorKey: "cup_dollar", title: "China $" },  
  { accessorKey: "total_amount", title: "Total Amount" },
  { accessorKey: "grand_total", title: "Grand Total" },   
];

    //   mergedData.push({
    //     mc_txn: item["MC_TXN"] || 0,
    //     cup_txn: item["CUP_TXN"] || 0,
    //     total_txn: item["TOTAL_TXN"] || 0,


export default function ReportTable() {
  const [data, setData] = useState<ReportRow[]>([]);

  useEffect(() => {
    const jsonData = localStorage.getItem("lastBranchReportData");
    if (jsonData) {
      setData(JSON.parse(jsonData));
    }
  }, []);

  const table = useReactTable({
    data,
    columns: columnsConfig.map(({ accessorKey, title }) => ({
      accessorKey,
      header: title,
      cell: ({ row }: { row: any }) => <div>{row.getValue(accessorKey)}</div>,
    })),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <h1 className="text-xl font-bold mb-4">Merged Report</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columnsConfig.length} className="text-center">
                  No data available. Upload a report first.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
