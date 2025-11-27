import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getCoreRowModel,
    useReactTable,
    flexRender,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { CheckboxColumn } from "@/components/common/DataTable/CheckboxColumn";
import { ActionDropdown } from "@/components/common/DataTable/ActionDropdown";
import { fetchTerminalApi, softDeleteMerchantApi } from "@/services/MerchantService";

export type Merchant = {
    id: string;
    merchant_name: string;
    terminal_code: string;
    branch_name: string;
    district_name: string;
    grand_total: number;
};

const columnsConfig = [
    { accessorKey: "merchant_name", title: "Merchant Name" },
    { accessorKey: "terminal_code", title: "Terminal Code" },
    { accessorKey: "branch_name", title: "Branch Name" },
    { accessorKey: "district_name", title: "District Name" },
    { accessorKey: "grand_total", title: "Grand Total" },    
];
export default function MerchantTable() {
    const navigate = useNavigate();
    const [data, setData] = useState<Merchant[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [pageIndex ] = useState(0);
    const [pageSize] = useState(10);
    const [searchQuery ] = useState("");
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem("userData") || "{}");
    

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetchTerminalApi();
            setData(response.data);
            setTotalItems(response.totalItems);
        } catch (error) {
            console.error("Error fetching terminals:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditTerminal = (data: any) => {
        try {
            console.log("data", data);
            console.log("the id fetched from the data is ", data.terminal_id);
            navigate(`/merchant/view/edit/${data.terminal_id}`, { state: data });
        } catch (error) { }
    };

    const handleDeleteTerminal = async (data: any) => {
        try {
            console.log("data", data.terminal_id);
            console.log("data from the response is", data);
            const terminalId = data.terminal_id;
            const isSoftDeleted = await softDeleteMerchantApi(terminalId);

            if (isSoftDeleted) {
                setData((prevData) => prevData.filter((item) => item.id !== terminalId));
                setTotalItems((prevTotal) => prevTotal - 1);

                toast({
                    title: "Success!",
                    description: `${data.merchant_name} merchant deleted!`,
                });
                // refresh table silently
                fetchData();

            } else {
                toast({
                    title: "Error",
                    description: "Failed to delete terminal. Please try again.",
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            const errorMessage =
                error.message || "Failed to delete terminal. Please try again.";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            })
        }
    };

    useEffect(() => {
        fetchData();
    }, [pageIndex, pageSize, searchQuery]);

    const pageCount = Math.ceil(totalItems / pageSize);

        const dynamicColumns = [
            CheckboxColumn,
            ...columnsConfig.map(({ accessorKey, title }) => ({
                accessorKey,
                header: title,
                cell: ({ row }: { row: any }) => <div>{row.getValue(accessorKey)}</div>,
            })),
        ];

        // Add Actions column ONLY for admin
        if (currentUser.role === "admin") {
            dynamicColumns.push({
                id: "actions",
                header: () => <span>Actions</span>,
                enableSorting: false,
                enableHiding: false,
                cell: ({ row }: { row: any }) => (
                    <ActionDropdown
                        onEdit={() => handleEditTerminal(row.original)}
                        onDelete={() => handleDeleteTerminal(row.original)}
                        role={currentUser.role}
                    />
                ),
            });
        }

        const table = useReactTable({
            data,
            columns: dynamicColumns,
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
                                <TableCell
                                    colSpan={columnsConfig.length + 2}
                                    className="text-center"
                                >
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columnsConfig.length + 2}
                                    className="text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {/* <PaginationControls
                currentPage={pageIndex}
                totalPages={pageCount}
                onPageChange={(page: number) => setPageIndex(page)}
            /> */}
        </div>
    );
}
