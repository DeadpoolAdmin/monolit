export interface INotification {
    _id: string;
    orgId: number;
    type: "ORDER_STATUS_CHANGED" | "SERVICE_RESERVATION_REJECTED" | "SERVICE_RESERVATION_STATUS_CHANGED" | string | "ORDER_REJECTED" | "SERVICE_REJECTED";
    title: string;
    message: string;
    availableTimeOptions?: Record<string, string[]> | null;
  
    // Depending on type, one of these may exist
    orderId?: number;
    serviceReservationId?: number;
  
    isRead: boolean;
    isForAdmin: boolean;
    rejectedItemsIds: number[];
    roomId: number;
    reason?: string | null;
  
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    __v: number;
  }
  