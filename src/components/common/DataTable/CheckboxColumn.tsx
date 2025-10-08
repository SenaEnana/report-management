import { Checkbox } from "@/components/ui/checkbox";

export const CheckboxColumn = {
  id: "select",
  header: ({ table }: { table: any }) => (
    <Checkbox
      className=""
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  ),
  cell: ({ row }: { row: any }) => (
    <Checkbox
      className=""
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  ),
  enableSorting: false,
  enableHiding: false,
};
