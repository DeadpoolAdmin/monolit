import React from 'react';

export type ToastType = "message" | "order" | "alarm" | "product" | "reservation" | "reservation_status" | "order_canceled" | "order_pending" | "order_ready" | "order_paid" | "request" | "order_rejected" | "service_rejected"

export const OrderStatus = {
    CANCELED: 'CANCELED',
    PENDING: 'PENDING',
    READY: 'READY',
    PAID: 'PAID',
    IN_PROGRESS: 'IN_PROGRESS',
    REJECTED: 'REJECTED',
    FINISHED: 'FINISHED',
    CONFIRMED: 'CONFIRMED',
    ACCEPTED: 'ACCEPTED',
    ORDER_REJECTED: 'ORDER_REJECTED',
    SERVICE_REJECTED: 'SERVICE_REJECTED',
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export const colors = {
    SUCCESS: '#00B79B',
    INFO: '#2E81EC',
    BLUE: '#3B82F6',
    RED: '#d9544f',
}

export const OrderStatusBackground = {
    CANCELED: '#9db3ce',
    PENDING: '#5c48cd',
    READY: '#34B69B',
    PAID: '#238f45',
    IN_PROGRESS: '#5c48cd',
    REJECTED: '#650301',
    FINISHED: '#34B69B',
    CONFIRMED: '#238f45',
    ACCEPTED: '#34B69B',
    ORDER_REJECTED: '#650301',
} as const;

export interface ToastItem {
    id: string;
    type: ToastType;
    message?: string | { message?: string; type?: ToastType; [key: string]: any };
    icon?: React.ReactNode;
    status?: string;
    orderStatus?: OrderStatus;
    showTimestamp?: boolean;
    timestamp: number;
    owner?: string
    orderId?: string;
    title?: string;
}

/**
 * @deprecated Use useToastMessages hook instead for i18n support
 * These are kept for backward compatibility only
 */
export const TOAST_MESSAGES: Record<ToastType, string> = {
    message: "New message received",
    order: "Order status updated",
    order_rejected: "Order has been rejected",
    alarm: "Alarm is set successfully",
    product: "Order submitted! We'll start processing it right away.",
    reservation: "Reservation Confirmed - We look forward to welcoming you.",
    request: "Request received — we'll process it soon",
    reservation_status: "Reservation status updated",
    order_canceled: "Order has been canceled",
    order_pending: "Your order is pending confirmation",
    order_ready: "Your order is ready for pickup!",
    order_paid: "Payment successful! Order confirmed.",
    service_rejected: "Service has been rejected",
};

// Type-based configurations
export const TYPE_CONFIGS = {
    // Products and Reservations
    product: {
        message: TOAST_MESSAGES.product,
        baseType: "order" as const,
        icon: "checkmark"
    },
    reservation: {
        message: TOAST_MESSAGES.reservation,
        baseType: "order" as const,
        icon: "checkmark"
    },
    reservation_status: {
        message: "Reservation status updated",
        baseType: "reservation" as const,
        icon: "checkmark"
    },

    order_rejected: {
        message: "Order has been rejected",
        baseType: "order" as const,
        icon: "close"
    },

    // Order Statuses
    order_canceled: {
        message: "Order has been canceled",
        orderStatus: OrderStatus.CANCELED,
        baseType: "order" as const,
        icon: "warning"
    },
    order_pending: {
        message: "Your order is pending confirmation",
        orderStatus: OrderStatus.PENDING,
        baseType: "order" as const,
        icon: "warning"
    },
    order_ready: {
        message: "Your order is ready for pickup!",
        orderStatus: OrderStatus.READY,
        baseType: "order" as const,
        icon: "checkmark"
    },
    order_paid: {
        message: "Payment successful! Order confirmed.",
        orderStatus: OrderStatus.PAID,
        baseType: "order" as const,
        icon: "checkmark"
    },

    // Messages
    message_new: {
        message: "New message received",
        status: "New",
        baseType: "message" as const,
        icon: "mail"
    },
    message_read: {
        message: "Message marked as read",
        status: "Read",
        baseType: "message" as const,
        icon: "mail"
    },

    // Defaults
    message: {
        message: "New message received",
        baseType: "message" as const,
        icon: "mail"
    },
    order: {
        message: "Order status updated",
        baseType: "order" as const,
        icon: "warning"
    },

    // request
    request: {
        message: "Request received — we’ll process it soon",
        baseType: "request" as const,
        icon: "checkmark"
    },

    alarm: {
        message: "Alarm is set successfully",
        baseType: "alarm" as const,
        icon: "checkmark"
    },

    service_rejected: {
        message: "Service has been rejected",
        baseType: "order" as const,
        icon: "close"
    },
} as const;

/**
 * @deprecated Use useToastMessages hook's getOrderActionMessage instead for i18n support
 * These are kept for backward compatibility only
 */
export const ORDER_ACTION_MESSAGES = {
    PRODUCT_ADDED: "Product added to your order",
    RESERVATION_ADDED: "Reservation added to your order",
    MULTIPLE_PRODUCTS: "Items added to your order",
    VIP_RESERVATION: "VIP reservation added to your order",
    CHECKOUT_COMPLETE: "Order checkout completed",
    MODIFICATION_MADE: "Order modification completed"
} as const;