import { useEffect, useState } from "react";
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
import { CheckboxColumn } from "@/components/common/DataTable/CheckboxColumn";
import { fetchMissedBranchTransactionApi } from "@/services/MissedTransactionService";

export type MissedTransaction  = {
    id: string;
    startDate: string;
    endDate: string;
    totalMissingDays: string;
    missingDates: string[];
};

const columnsConfig = [
    { accessorKey: "startDate", title: "Start Date" },
    { accessorKey: "endDate", title: "End Date" },
    { accessorKey: "totalMissingDays", title: "Total Missing Date" },
    { accessorKey: "missingDates", title: "Missing Dates" }, 
];

export default function MissedBranchDate() {
    const [data, setData] = useState<MissedTransaction[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [pageIndex ] = useState(0);
    const [pageSize] = useState(10);
    const [searchQuery ] = useState("");
    const [loading, setLoading] = useState(false);

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetchMissedBranchTransactionApi();
                setData([response.data]);
                setTotalItems(1);
            } catch (error) {
                console.error("Error fetching terminals:", error);
            } finally {
                setLoading(false);
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
                cell: (props: any) => {
                    const value = props.getValue();

                    if (Array.isArray(value)) {
                        return (
                            <div className="max-h-32 overflow-y-auto p-2 border rounded">
                                {value.map((date: string, i: number) => (
                                    <div key={i}>{date}</div>
                                ))}
                            </div>
                        );
                    }

                    return <div>{value}</div>;
                }
            })),
        ];

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
        </div>
    );
}
