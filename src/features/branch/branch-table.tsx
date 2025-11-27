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
import { useToast } from "@/hooks/use-toast";
import { CheckboxColumn } from "@/components/common/DataTable/CheckboxColumn";
// import { PaginationControls } from "@/components/common/DataTable/PaginationControls";
import { ActionDropdown } from "@/components/common/DataTable/ActionDropdown";
import { downloadBranchesApi, fetchBranchApi, softDeleteBranchApi } from "@/services/BranchService";
import { Download } from "lucide-react";

export type Merchant = {
    id: string;
    branch_name: string;
    district_name: string;
    role: string;
};

const columnsConfig = [
    { accessorKey: "branch_name", title: "Branch Name" },
    { accessorKey: "district_name", title: "District Name" },  
];
export default function BranchTable() {
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
                        onEdit={() => handleEditBranch(row.original)}
                        onDelete={() => handleDeleteBranch(row.original)}
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
              <Button className="bg-amber-500 float-end m-2"
                 onClick={() => { downloadBranchesApi()
                  }}
                    >
                    <Download /> Export
                </Button>
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
