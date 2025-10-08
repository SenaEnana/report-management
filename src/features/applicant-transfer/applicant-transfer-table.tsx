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
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import { CheckboxColumn } from "@/components/common/DataTable/CheckboxColumn";
import { PaginationControls } from "@/components/common/DataTable/PaginationControls";
import { ActionDropdown } from "@/components/common/DataTable/ActionDropdown";
import { getApplicantApi } from "@/services/ApplicantsService";
import { fetchApplicantTransfers, filterApplicantTransferApi, getApplicantTransferColumnApi, softDeleteApplicantTransferApi } from "@/services/ApplicantTransferService";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
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

const columnsConfig: {
    accessorKey: string;
    title: string;
    cell?: ({ row }: { row: any }) => JSX.Element;
}[] = [
        { accessorKey: "applicant_name", title: "Applicant Name" },
        { accessorKey: "transferd_from", title: "Transferred Place" },
        { accessorKey: "transferd_date", title: "Transferred Date" },
        { accessorKey: "year_name", title: "Year" },
    ];

export default function ApplicantTransferTable() {
    const navigate = useNavigate();
    const [data, setData] = useState<ApplicantTransfer[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const { toast } = useToast();

    const [loading, setLoading] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filters, setFilters] = useState([
        { column: "", operator: "=", value: "" },
    ]);
    const [filterColumns, setFilterColumns] = useState<string[]>([]);
    const [isFilterLoading, setIsFilterLoading] = useState(true);

    const { data: applicants } = useQuery({
        queryKey: ["applicants"],
        queryFn: getApplicantApi,
    });
    const { data: years } = useQuery({
        queryKey: ["years"],
        queryFn: getYearApi,
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetchApplicantTransfers(
                pageIndex,
                pageSize,
                searchQuery
            );
            setData(response.data);
            setTotalItems(response.totalItems);
        } catch (error) {
            console.error("Error fetching degree applicant:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchColumns = async () => {
            try {
                const columns = await getApplicantTransferColumnApi();
                setFilterColumns(columns);
            } catch (error) {
                console.error("Error fetching columns:", error);
            } finally {
                setIsFilterLoading(false);
            }
        };

        fetchColumns();
    }, []);

    const handleApplyFilters = async () => {
        try {
            setLoading(true);
            const { filteredData, totalItems } = await filterApplicantTransferApi(
                pageSize,
                filters
            );
            setData(filteredData);
            setTotalItems(totalItems);
        } catch (error) {
            console.error("Error applying filters:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleCloseFilters = () => {
        setFilters([{ column: "", operator: "=", value: "" }]);
        fetchData();
        setIsFilterModalOpen(false);
    };

    const handleSearchChange = debounce((value: string) => {
        setSearchQuery(value);
        setPageIndex(0); // Reset to the first page on new search
    }, 300);

    const handleEditApplicant = (data: any) => {
        try {
            console.log("data", data);
            navigate(`/applicant/applicant-transfer/view/edit/${data.id}`, { state: data });
        } catch (error) { }
    };

    const handleViewApplicant = (data: any) => {
        console.log("Navigating with data:", data);
        try {
            navigate(`/applicant/applicant-transfer/view/detail/${data.id}`, { state: data });
        } catch (error) {
            console.error("Error navigating to detail view:", error);
        }
    };

    const handleDeleteApplicant = async (data: any) => {
        try {
            console.log("data", data.id);
            const applicantId = data.id;
            const isSoftDeleted = await softDeleteApplicantTransferApi(applicantId);
            if (isSoftDeleted) {
                // setPageIndex(1);
                setData((prevData) => prevData.filter((item) => item.id !== applicantId));
                setTotalItems((prevTotal) => prevTotal - 1);
                toast({
                    title: "Success!",
                    description: `${data.applicant_name} applicant deleted!`,
                });
            } else {
                toast({
                    title: "Error",
                    description: "Failed to delete applicant. Please try again.",
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            const errorMessage =
                error.message || "Failed to delete applicant. Please try again.";
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
            ...columnsConfig.map(({ accessorKey, title, cell }) => ({
                accessorKey,
                header: title,
                cell:
                    cell ||
                    (({ row }: { row: any }) => <div>{row.getValue(accessorKey)}</div>),
            })),
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }: { row: any }) => (
                    <ActionDropdown
                        onView={() => {
                            handleViewApplicant(row.original);
                        }}
                        onEdit={() => handleEditApplicant(row.original)}
                        onDelete={() => handleDeleteApplicant(row.original)}
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
                    <Button variant="outline" onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}>
                        {/* <Filter className="h-4 w-4" /> */}
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
                    {isFilterModalOpen && (
                        <div className="filter-modal p-4 shadow-lg rounded-lg">
                            {isFilterLoading ? (
                                <div>Loading filters...</div>
                            ) : (
                                filters.map((filter, index) => (
                                    <div key={index} className="flex gap-4 mb-4">
                                        <Select
                                            value={filter.column}
                                            onValueChange={(value) =>
                                                setFilters((prev) =>
                                                    prev.map((f, i) =>
                                                        i === index ? { ...f, column: value } : f
                                                    )
                                                )
                                            }
                                        >
                                            <SelectTrigger className="w-[120px]">
                                                {filter.column || "Select Column"}
                                            </SelectTrigger>
                                            <SelectContent>
                                                {filterColumns.map((column) => (
                                                    <SelectItem key={column} value={column}>
                                                        {column}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Select
                                            value={filter.operator}
                                            onValueChange={(value) =>
                                                setFilters((prev) =>
                                                    prev.map((f, i) =>
                                                        i === index ? { ...f, operator: value } : f
                                                    )
                                                )
                                            }
                                        >
                                            <SelectTrigger className="w-[120px]">
                                                {filter.operator}
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="=">=</SelectItem>
                                                <SelectItem value="!=">!=</SelectItem>
                                                <SelectItem value=">">&gt;</SelectItem>
                                                <SelectItem value="<">&lt;</SelectItem>
                                                <SelectItem value="like">Like</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            placeholder="Value"
                                            value={filter.value}
                                            onChange={(e) =>
                                                setFilters((prev) =>
                                                    prev.map((f, i) =>
                                                        i === index ? { ...f, value: e.target.value } : f
                                                    )
                                                )
                                            }
                                        />
                                    </div>
                                ))
                            )}
                            <div className="flex justify-end gap-4">
                                <Button variant="outline" onClick={handleCloseFilters}>
                                    Close
                                </Button>
                                <Button className="bg-amber-500" onClick={handleApplyFilters}>Apply</Button>
                            </div>
                        </div>
                    )}
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
                                    {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    CSV
                                    {/* <DropdownMenuShortcut>⌘B</DropdownMenuShortcut> */}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    PDF
                                    {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
