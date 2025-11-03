import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { CheckboxColumn } from "@/components/common/DataTable/CheckboxColumn";
import { PaginationControls } from "@/components/common/DataTable/PaginationControls";
import { ActionDropdown } from "@/components/common/DataTable/ActionDropdown";
import { fetchBranchApi, softDeleteBranchApi } from "@/services/BranchService";

export type Merchant = {
    id: string;
    branch_name: string;
    district_name: string;
};

const columnsConfig = [
    { accessorKey: "branch_name", title: "Branch Name" },
    { accessorKey: "district_name", title: "District Name" },  
];
export default function BranchTable() {
    const navigate = useNavigate();
    const [data, setData] = useState<Merchant[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize] = useState(10);
    const [searchQuery ] = useState("");
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetchBranchApi();
            setData(response.data);
            setTotalItems(response.totalItems);
        } catch (error) {
            console.error("Error fetching branches:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditBranch = (data: any) => {
        try {
            navigate(`/branch/view/edit/${data.branch_id}`, { state: data });
        } catch (error) { }
    };

    const handleDeleteBranch = async (data: any) => {
        try {
            const branchId = data.branch_id;
            const isSoftDeleted = await softDeleteBranchApi(branchId);

            if (isSoftDeleted) {
                setData((prevData) => prevData.filter((item) => item.id !== branchId));
                setTotalItems((prevTotal) => prevTotal - 1);

                toast({
                    title: "Success!",
                    description: `${data.branch_name} branch deleted!`,
                });
                // refresh table silently
                fetchData();

            } else {
                toast({
                    title: "Error",
                    description: "Failed to delete branch. Please try again.",
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            const errorMessage =
                error.message || "Failed to delete branch. Please try again.";
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

    const table = useReactTable({
        data,
        columns: [
            CheckboxColumn,
            ...columnsConfig.map(({ accessorKey, title }) => ({
                accessorKey,
                header: title,
                cell: ({ row }: { row: any }) => <div>{row.getValue(accessorKey)}</div>,
            })),
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }: { row: any }) => (
                    <ActionDropdown
                        onEdit={() => {
                            handleEditBranch(row.original);
                        }}
                        onDelete={() => {
                            handleDeleteBranch(row.original);
                        }}
                        type="user"
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
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="font-semibold text-navy-800 border-gray-200"
                            >
                                {/* <Download className="h-4 w-4" /> */}
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M6.66663 14.1667L9.99996 17.5M9.99996 17.5L13.3333 14.1667M9.99996 17.5V10M16.6666 13.9524C17.6845 13.1117 18.3333 11.8399 18.3333 10.4167C18.3333 7.88536 16.2813 5.83333 13.75 5.83333C13.5679 5.83333 13.3975 5.73833 13.3051 5.58145C12.2183 3.73736 10.212 2.5 7.91663 2.5C4.46485 2.5 1.66663 5.29822 1.66663 8.75C1.66663 10.4718 2.36283 12.0309 3.48908 13.1613"
                                        stroke="#344054"
                                        stroke-width="1.66667"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                Export
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-16 flex justify-center">
                            <DropdownMenuGroup className="w-full">
                                <DropdownMenuItem>
                                    Excel
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    CSV
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    PDF
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
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
            <PaginationControls
                currentPage={pageIndex}
                totalPages={pageCount}
                onPageChange={(page: number) => setPageIndex(page)}
            />
        </div>
    );
}
