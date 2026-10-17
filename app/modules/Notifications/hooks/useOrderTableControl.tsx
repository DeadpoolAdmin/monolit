import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { useKeydown } from "@hotel-smarters/use-key-down-control";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { setRootControl } from "@/slices/RootControlSlice";
import { useDispatch } from "react-redux";

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

interface OrderTableControlOptions {
  items: OrderItem[];
  onNextPage?: () => void;
  onPrevPage?: () => void;
  itemsPerPage?: number;
  currentPage?: number;
  totalPages?: number;
  onClose?: () => void;
  onRemoveItem?: (itemId: number) => void;
}

export const useOrderTableControl = (options: OrderTableControlOptions) => {
  const {
    items,
    onNextPage,
    onPrevPage,
    itemsPerPage = 3,
    currentPage = 1,
    totalPages = 1,
    onClose,
    onRemoveItem,
  } = options;

  const rootControl = useSelector(
    (state: any) => state.rootControl.rootControl
  );
  const dispatch = useDispatch();

  const [index, setIndex] = useState<number>(0);

  const tableRef = useRef<HTMLTableElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const setControl = useCallback(
    (control: typeof ROOT_CONTROL | null) => {
      dispatch(setRootControl(control));
    },
    [dispatch]
  );

  const scrollToRow = useCallback(() => {
    if (tableRef && tableRef.current && containerRef && containerRef.current) {
      const tbody = tableRef.current.querySelector("tbody");
      if (tbody && tbody.rows[index]) {
        const row = tbody.rows[index];
        const container = containerRef.current;

        const rowHeight = row.offsetHeight;

        // Start scrolling from index 2, scroll one row at a time, otherwise scroll to top
        const scrollOffset = index >= 2 ? (index - 1) * rowHeight : 0;

        container.scrollTo({
          top: scrollOffset,
          behavior: "smooth",
        });
      }
    }
  }, [index]);

  const controls = useMemo(
    () => ({
      isActive: rootControl === ROOT_CONTROL.NOTIFICATIONS_ORDER_TABLE,
      id: "NOTIFICATIONS_CONTROL.ORDER_TABLE",
      up: () => {
        if (index === 0) {
          // If we're at first item, go to previous page if available
          if (currentPage > 1 && onPrevPage) {
            onPrevPage();
            return;
          }
          return;
        }
        setIndex((prev) => prev - 1);
      },
      down: () => {
        // If we're at the last item of the current page
        if (index === itemsPerPage - 1 || index === items.length - 1) {
          // Try to go to next page if available
          if (currentPage < totalPages && onNextPage) {
            onNextPage();
            return;
          }

          dispatch(setRootControl(ROOT_CONTROL.NOTIFICATIONS_ORDER_TABLE_ORDER_CLOSE))
        }
        // Otherwise, move to next item if available
        if (index < items.length - 1) {
          setIndex((prev) => prev + 1);
        }
      },
      back: () => {
        if (currentPage && currentPage > 1 && onPrevPage) {
          // If not on page 1, go to previous page
          onPrevPage();
        } else {
          // If on page 1, close the popup
          if (onClose) {
            setControl(ROOT_CONTROL.NOTIFICATIONS as unknown as typeof ROOT_CONTROL);
            onClose();
          }
        }
      },

      ok: () => {
        const itemToRemove = items[index];
        if (itemToRemove && onRemoveItem) {
          onRemoveItem(itemToRemove.id);
          
          // If this is the last item on the current page
          if (items.length === 1) {
            // If on page 1 and this is the last item, close the popup
            if (currentPage === 1) {
              if (onClose) {
                setControl(ROOT_CONTROL.NOTIFICATIONS as unknown as typeof ROOT_CONTROL);
                onClose();
              }
            } 
            // If on page > 1, navigate to previous page
            else if (currentPage > 1 && onPrevPage) {
              onPrevPage();
            }
          } 
          // Adjust index if needed after removal (when there are still items left)
          else if (index >= items.length - 1 && index > 0) {
            setIndex((prev) => prev - 1);
          }
        }
      }
    }),
    [
      index,
      rootControl,
      items,
      currentPage,
      totalPages,
      onNextPage,
      onPrevPage,
      itemsPerPage,
      onClose,
      setControl,
      onRemoveItem,
      dispatch,
    ]
  );

  useKeydown(controls);


  useEffect(() => {
    scrollToRow();
  }, [index, scrollToRow]);

  // Reset index to 0 when page changes
  useEffect(() => {
    setIndex(0);
  }, [currentPage]);

  // Adjust index if it's out of bounds after items change
  useEffect(() => {
    if (items.length > 0 && index >= items.length) {
      setIndex(items.length - 1);
    }
  }, [items.length, index]);

  return {
    index,
    tableRef,
    containerRef,
  };
};

