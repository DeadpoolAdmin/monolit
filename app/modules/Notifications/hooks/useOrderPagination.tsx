import { useState, useMemo, useCallback, useEffect } from "react";

interface OrderItem {
  id: number;
  inventory?: {
    id: number;
    name: string;
    image: string;
  };
  quantity: number;
  price: number;
  status?: string;
}

interface UseOrderPaginationProps {
  items: OrderItem[];
  itemsPerPage?: number;
}

export const useOrderPagination = ({
  items,
  itemsPerPage = 3,
}: UseOrderPaginationProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(items.length / itemsPerPage);
  }, [items.length, itemsPerPage]);

  // Get current page items
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  // Handle next page
  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => {
      if (prev < totalPages) {
        return prev + 1;
      }
      return prev;
    });
  }, [totalPages]);

  // Handle previous page
  const handlePrevPage = useCallback(() => {
    setCurrentPage((prev) => {
      if (prev > 1) {
        return prev - 1;
      }
      return prev;
    });
  }, []);

  // Reset to first page when items change
  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // Adjust current page if it's beyond total pages after items are removed
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  return {
    paginatedItems,
    currentPage,
    totalPages,
    handleNextPage,
    handlePrevPage,
    resetPagination,
  };
};

