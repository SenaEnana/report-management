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
import {
  fetchCampusCurriculumApi,
  filterCampusCurriculumApi,
  getCampusCurriculumColumnApi,
  softDeleteCampusCurriculumApi,
} from "@/services/CampusCurriculumService";
import { getCampusApi } from "@/services/CampusService";
import { useQuery } from "@tanstack/react-query";
import { getCurriculumApi } from "@/services/CurriculumService";
import { getAdmissionTypeApi } from "@/services/AdmissionTypeService";
import { getBatchYearApi } from "@/services/BatchYearService";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

export type CampusCurriculum = {
  id: string;
  campus_id: number;
  curriculum_id: number;
  admission_type_id: number;
  batch_year_id: string;
  total_year: number;
  total_semester: number;
  semester_per_year: number;
  remarks: string;
};

const columnsConfig: {
  accessorKey: string;
  title: string;
  cell?: ({ row }: { row: any }) => JSX.Element;
}[] = [
    { accessorKey: "campus_name", title: "Campus" },
    { accessorKey: "curriculum_name", title: "Curriculum" },
    { accessorKey: "admission_type_name", title: "Admission Type" },
  ];

export default function CampusCurriculumTable() {
  const navigate = useNavigate();
  const [data, setData] = useState<CampusCurriculum[]>([]);
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

  const { data: campuses } = useQuery({
    queryKey: ["campuses"],
    queryFn: getCampusApi,
  });

  const { data: curriculums } = useQuery({
    queryKey: ["curriculums"],
    queryFn: getCurriculumApi,
  });

  const { data: admissionTypes } = useQuery({
    queryKey: ["admissionTypes"],
    queryFn: getAdmissionTypeApi,
  });

  const { data: batchYears } = useQuery({
    queryKey: ["batchYears"],
    queryFn: getBatchYearApi,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchCampusCurriculumApi(
        pageIndex,
        pageSize,
        searchQuery
      );
      setData(response.data);
      setTotalItems(response.totalItems);
    } catch (error) {
      console.error("Error fetching campus curriculum:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const columns = await getCampusCurriculumColumnApi();
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
      const mappedFilters = filters.map((filter) => {
        if (filter.column === "campus_id") {
          const campus = campuses.find((d: { id: number, name: string }) => d.name === filter.value);
          return { ...filter, value: campus?.id || filter.value };
        } else if (filter.column === "curriculum_id") {
          const curriculum = curriculums.find((d: { id: number, name: string }) => d.name === filter.value)
          return { ...filter, value: curriculum?.id || filter.value };
        } else if (filter.column === "admission_type_id") {
          const admissionType = admissionTypes.find((d: { id: number, name: string }) => d.name === filter.value);
          return { ...filter, value: admissionType?.id || filter.value };
        } else if (filter.column === "batch_year_id") {
          const batchYear = batchYears.find((d: { id: number, name: string }) => d.name === filter.value)
          return { ...filter, value: batchYear?.id || filter.value };
        }
        return filter;
      });

      const { filteredData, totalItems } = await filterCampusCurriculumApi(
        pageSize,
        mappedFilters
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

  const handleEditCampusCurriculum = (data: any) => {
    try {
      console.log("data", data);
      navigate(`/curriculum/campus-curriculum/view/edit/${data.id}`, { state: data });
    } catch (error) { }
  };

  const handleViewCampusCurriculum = (data: any) => {
    console.log("Navigating with data:", data);
    try {
      navigate(`/curriculum/campus-curriculum/view/detail/${data.id}`, { state: data });
    } catch (error) {
      console.error("Error navigating to detail view:", error);
    }
  };

  const handleDeleteCampusCurriculum = async (data: any) => {
    try {
      console.log("data", data.id);
      const campusCurriculumId = data.id;
      const isSoftDeleted = await softDeleteCampusCurriculumApi(campusCurriculumId);
      if (isSoftDeleted) {
        setData((prevData) => prevData.filter((item) => item.id !== campusCurriculumId));
        setTotalItems((prevTotal) => prevTotal - 1);
        // setPageIndex(1);
        toast({
          title: "Success!",
          description: `${data.campus_id} campus-curriculum deleted!`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete campus-curriculum. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.message || "Failed to create faculty. Please try again.";
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

  const mappedData = data.map((campusCurriculum) => {
    const campus = campuses?.find((f: { id: number }) => f.id === campusCurriculum.campus_id);
    const curriculum = curriculums?.find(
      (f: { id: number }) => f.id === campusCurriculum.curriculum_id
    );
    const admissionType = admissionTypes?.find(
      (f: { id: number }) => f.id === campusCurriculum.admission_type_id
    );
    return {
      ...campusCurriculum,
      campus_name: campus ? campus.name : "Unknown campus",
      curriculum_name: curriculum ? curriculum.name : "Unknown curriculum",
      admission_type_name: admissionType
        ? admissionType.name
        : "Unknown admission type",
    };
  });

  const pageCount = Math.ceil(totalItems / pageSize);

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
              handleViewCampusCurriculum(row.original);
            }}
            onEdit={() => handleEditCampusCurriculum(row.original)}
            onDelete={() => handleDeleteCampusCurriculum(row.original)}
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
                    {filter.column === "campus_id" ? (
                      <Select
                        value={filter.value}
                        onValueChange={(value) =>
                          setFilters((prev) =>
                            prev.map((f, i) =>
                              i === index ? { ...f, value } : f
                            )
                          )
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          {campuses.find((d: { id: string }) => d.id.toString() === filter.value)?.name || "Select Campus"}
                        </SelectTrigger>
                        <SelectContent>
                          {campuses.map((campus: { id: number; name: string }) => (
                            <SelectItem key={campus.id} value={campus.id.toString()}>
                              {campus.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : filter.column === "curriculum_id" ? (
                      <Select
                        value={filter.value}
                        onValueChange={(value) =>
                          setFilters((prev) =>
                            prev.map((f, i) =>
                              i === index ? { ...f, value } : f
                            )
                          )
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          {curriculums.find((d: { id: string }) => d.id.toString() === filter.value)?.name || "Select Curriculum"}
                        </SelectTrigger>
                        <SelectContent>
                          {curriculums.map((curriculum: { id: number; name: string }) => (
                            <SelectItem key={curriculum.id} value={curriculum.id.toString()}>
                              {curriculum.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : filter.column === "admission_type_id" ? (
                      <Select
                        value={filter.value}
                        onValueChange={(value) =>
                          setFilters((prev) =>
                            prev.map((f, i) =>
                              i === index ? { ...f, value } : f
                            )
                          )
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          {admissionTypes.find((d: { id: string }) => d.id.toString() === filter.value)?.name || "Select Admission Type"}
                        </SelectTrigger>
                        <SelectContent>
                          {admissionTypes.map((admissionType: { id: number; name: string }) => (
                            <SelectItem key={admissionType.id} value={admissionType.id.toString()}>
                              {admissionType.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : filter.column === "batch_year_id" ? (
                      <Select
                        value={filter.value}
                        onValueChange={(value) =>
                          setFilters((prev) =>
                            prev.map((f, i) =>
                              i === index ? { ...f, value } : f
                            )
                          )
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          {batchYears.find((d: { id: string }) => d.id.toString() === filter.value)?.name || "Select Batch Year"}
                        </SelectTrigger>
                        <SelectContent>
                          {batchYears.map((batchYear: { id: number; year: number }) => (
                            <SelectItem key={batchYear.id} value={batchYear.id.toString()}>
                              {batchYear.year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
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
                    )}
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