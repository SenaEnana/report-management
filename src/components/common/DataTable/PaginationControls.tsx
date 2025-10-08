import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    const pageNumbers = [];
    if (currentPage <= 3) {
      for (let i = 0; i < 5; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push('ellipsis');
      pageNumbers.push(totalPages - 1);
    } else if (currentPage >= totalPages - 4) {
      pageNumbers.push(0);
      pageNumbers.push('ellipsis');
      for (let i = totalPages - 5; i < totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(0);
      pageNumbers.push('ellipsis');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push('ellipsis');
      pageNumbers.push(totalPages - 1);
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(0)}
        disabled={currentPage === 0}
      >
        <DoubleArrowLeftIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>

      {getPageNumbers().map((pageNum, index) =>
        pageNum === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="px-2">...</span>
        ) : (
          <Button
            key={`page-${pageNum}`}
            variant={currentPage === pageNum ? "default" : "outline"}
            onClick={() => handlePageChange(pageNum as number)}
          >
            {(pageNum as number) + 1}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(totalPages - 1)}
        disabled={currentPage === totalPages - 1}
      >
        <DoubleArrowRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}