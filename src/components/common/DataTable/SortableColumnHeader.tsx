import { Button } from "@/components/ui/button"
import {
    CaretSortIcon
  } from "@radix-ui/react-icons"
export function SortableColumnHeader({
    column,
    title,
  }: {
    column: any;
    title: string;
  }) {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {title}
        <CaretSortIcon className="ml-2 h-4 w-4" />
      </Button>
    );
  }
  