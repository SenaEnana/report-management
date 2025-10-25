"use client";

import { useEffect, useState } from "react";
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type ReportRow = {
  merchant_name: string;
  terminal_id: string;
  sum_local_txn: number;
  sum_local_txn_amount: number;
  sum_visa_txn: number;
  visa_dollar: string;
  branch: string;
  district: string;
};

const columnsConfig: {
  accessorKey: keyof ReportRow;
  title: string;
}[] = [
  { accessorKey: "merchant_name", title: "Merchant" },
  { accessorKey: "terminal_id", title: "Terminal ID" },
  { accessorKey: "sum_local_txn", title: "Local Txns" },
  { accessorKey: "sum_local_txn_amount", title: "Local Amount" },
  { accessorKey: "sum_visa_txn", title: "VISA Txns" },
  { accessorKey: "visa_dollar", title: "VISA $ (USD)" },
  { accessorKey: "branch", title: "Branch" },
  { accessorKey: "district", title: "District" },
];

export default function ReportTable() {
  const [data, setData] = useState<ReportRow[]>([]);

  useEffect(() => {
    const jsonData = localStorage.getItem("lastMerchantReportData");
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
