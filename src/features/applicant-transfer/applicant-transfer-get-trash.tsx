import { useEffect, useState } from "react";
import {
    getCoreRowModel,
    useReactTable,
    flexRender,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";
import { useToast } from "@/hooks/use-toast";
import { Trash2, } from "lucide-react";
import { CheckboxColumn } from "@/components/common/DataTable/CheckboxColumn";
import { PaginationControls } from "@/components/common/DataTable/PaginationControls";
import { ActionDropdown } from "@/components/common/DataTable/ActionDropdown";
import { getTrashedApplicantTransferApi, restoreApplicantTransferApi } from "@/services/ApplicantTransferService";
import { useQuery } from "@tanstack/react-query";
import { getApplicantApi } from "@/services/ApplicantsService";
import { getYearApi } from "@/services/YearService";

export type ApplicantTransfer = {
    id: number;
    applicant_id: number;
    transferd_from: string;
    transferd_date: string;
    year_id: number;
    semester_id: number;
    transfer_reason: string;
    remarks: string;
};

export default function ApplicantTransferGetTrash() {
    const [data, setData] = useState<ApplicantTransfer[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getTrashedApplicantTransferApi(
                pageIndex,
                pageSize,
                searchQuery
            )
            setData(response.data);
            setTotalItems(response.totalItems);
        } catch (error) {
            console.error("Error fetching applicant trashed resources:", error);
        } finally {
            setLoading(false);
        }
    };

    const { data: applicants } = useQuery({
        queryKey: ["applicants"],
        queryFn: getApplicantApi,
    });
    const { data: years } = useQuery({
        queryKey: ["years"],
        queryFn: getYearApi,
    });

    const handleSearchChange = debounce((value: string) => {
        setSearchQuery(value);
        setPageIndex(0);
    }, 300);

    const handleRestoreApplicantTransfer = async (data: any) => {
        try {
            const applicantTransferId = data.id;
            const response = await restoreApplicantTransferApi(applicantTransferId);
            console.log("Restore response:", response);
            if (response && response.id === applicantTransferId) {
                setData((prevData) => prevData.filter((item) => item.id !== applicantTransferId));
                setTotalItems((prevTotal) => prevTotal - 1);
                toast({
                    title: "Success!",
                    description: `${data.applicant_id} applicant restored!`,
                });
            } else {
                toast({
                    title: "Error",
                    description: "Failed to restore applicant. Please try again.",
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            const errorMessage =
                error.message || "Failed to restore applicant. Please try again.";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        }
    };
    useEffect(() => {
        fetchData();
    }, [pageIndex, pageSize, searchQuery]);

    const pageCount = Math.ceil(totalItems / pageSize);

    const columnsConfig = [
        { accessorKey: "applicant_name", title: "Applicant Name" },
        { accessorKey: "transferd_from", title: "Transfer Place" },
        { accessorKey: "transferd_date", title: "Transfer Date" },
        { accessorKey: "year_name", title: "Year Name" },
        { accessorKey: "remarks", title: "Remarks" },
    ];

    const mappedData = data.map((applicant) => {
        const applicantData = applicants?.find((f: { id: number; name: string }) => f.id === applicant.applicant_id);
        const yearData = years?.find((f: { id: number; name: string }) => f.id === applicant.year_id);
        return {
            ...applicant,
            applicant_name: applicantData ? applicantData.name : "Unknown applicant",
            year_name: yearData ? yearData.name : "unknown year",
        };
    });
    const table = useReactTable({
        data: mappedData,
        columns: [
            CheckboxColumn,
            ...columnsConfig.map(({ accessorKey, title }) => ({
                accessorKey,
                header: title,
            })),
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }: { row: any }) => (
                    <ActionDropdown
                        type="trash"
                        onRestore={() => { handleRestoreApplicantTransfer(row.original) }}
                    />
                ),
            },
        ],
        pageCount,
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
        state: {
            pagination: { pageIndex, pageSize },
        },
    });

    return (
        <div className="w-full">
            <div className="flex justify-between mb-4">
                <div className="flex items-center gap-4 m-2">
                    <Button variant="outline">
                        <Trash2 className="h-4 w-4" />
                        Delete
                    </Button>
                    <Button variant="outline">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M5 10H15M2.5 5H17.5M7.5 15H12.5"
                                stroke="#344054"
                                stroke-width="1.66667"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                        Filter
                    </Button>
                </div>
                <Input
                    type="text"
                    placeholder="Search..."
                    className="max-w-sm"
                    onChange={(e) => handleSearchChange(e.target.value)}
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columnsConfig.length + 1} className="text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length ? (
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
                                <TableCell colSpan={columnsConfig.length + 1} className="text-center">
                                    No results found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <PaginationControls
                currentPage={pageIndex}
                totalPages={pageCount}
                onPageChange={setPageIndex}
            />
        </div>
    );
}
