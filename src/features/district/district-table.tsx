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
import { downloadDistrictsApi, fetchDistrictApi, softDeleteDistrictApi } from "@/services/DistrictService";
import { Download } from "lucide-react";

export type Merchant = {
    id: string;
    district_name: string;
};

const columnsConfig = [
    { accessorKey: "district_name", title: "District Name" },  
];
export default function DistrictTable() {
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
            const response = await fetchDistrictApi();
            setData(response.data);
            setTotalItems(response.totalItems);
        } catch (error) {
            console.error("Error fetching districts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditDistrict = (data: any) => {
        try {
            navigate(`/district/view/edit/${data.district_id}`, { state: data });
        } catch (error) { }
    };

    const handleDeleteDistrict = async (data: any) => {
        try {
            const districtId = data.district_id;
            const isSoftDeleted = await softDeleteDistrictApi(districtId);

            if (isSoftDeleted) {
                setData((prevData) => prevData.filter((item) => item.id !== districtId));
                setTotalItems((prevTotal) => prevTotal - 1);

                toast({
                    title: "Success!",
                    description: `${data.district_name} district deleted!`,
                });
                // refresh table silently
                fetchData();

            } else {
                toast({
                    title: "Error",
                    description: "Failed to delete district. Please try again.",
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            const errorMessage =
                error.message || "Failed to delete district. Please try again.";
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
                         onEdit={() => handleEditDistrict(row.original)}
                         onDelete={() => handleDeleteDistrict(row.original)}
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
    // const table = useReactTable({
    //     data,
    //     columns: [
    //         CheckboxColumn,
    //         ...columnsConfig.map(({ accessorKey, title }) => ({
    //             accessorKey,
    //             header: title,
    //             cell: ({ row }: { row: any }) => <div>{row.getValue(accessorKey)}</div>,
    //         })),
    //         {
    //             id: "actions",
    //             header: "Actions",
    //             cell: ({ row }: { row: any }) => (
    //                 <ActionDropdown
    //                     onEdit={() => {
    //                         handleEditDistrict(row.original);
    //                     }}
    //                     onDelete={() => {
    //                         handleDeleteDistrict(row.original);
    //                     }}
    //                     type="default"
    //                     role = {currentUser.role}
    //                 />
    //             ),
    //         },
    //     ],
    //     pageCount,
    //     manualPagination: true,
    //     getCoreRowModel: getCoreRowModel(),
    //     state: {
    //         pagination: { pageIndex, pageSize },
    //     },
    // });

    return (
        <div className="w-full">
            <div className="flex justify-between mb-4">
            <Button className="float-end m-2 bg-amber-500"
                 onClick={() => { downloadDistrictsApi()
                  }}
                    >
                   <Download/> Export
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
