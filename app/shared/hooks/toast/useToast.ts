import { OrderStatus, ToastItem, ToastType, TYPE_CONFIGS, colors, OrderStatusBackground } from "@/shared/types/toast/toast.type";
import { useCallback, useState } from "react";
import React from "react";
import { IoCheckmarkCircle, IoCloseCircle, IoMail } from "react-icons/io5";
import { MdOutlinePending } from "react-icons/md";

interface ToastData {
    status?: string;
    type?: string;
    message?: string;
    updatedAt?: string;
    content?: string;
    owner?: string
    sender?: { fullName: string }
    title?: string;
}

const getIconByType = (type: string, status?: string): React.ReactNode => {
    const config = TYPE_CONFIGS[type as keyof typeof TYPE_CONFIGS];

    if (!config) {
        return React.createElement(IoCheckmarkCircle, { style: { color: colors.INFO } });
    }

    // Handle order types with status-specific icons
    if (config.baseType === 'order' && status) {
        // Normalize status to match enum format (uppercase with underscores)
        const normalizedStatus = status.toUpperCase().replace(/\s+/g, '_') as OrderStatus;

        switch (normalizedStatus) {
            case OrderStatus.PENDING:
            case OrderStatus.IN_PROGRESS:
                return React.createElement(MdOutlinePending, { style: { color: OrderStatusBackground[normalizedStatus] } });
            case OrderStatus.CONFIRMED:
            case OrderStatus.FINISHED:
            case OrderStatus.PAID:
            case OrderStatus.READY:
            case OrderStatus.ACCEPTED:
                return React.createElement(IoCheckmarkCircle, { style: { color: OrderStatusBackground[normalizedStatus] } });
            case OrderStatus.REJECTED:
            case OrderStatus.CANCELED:
                return React.createElement(IoCloseCircle, { style: { color: OrderStatusBackground[normalizedStatus] } });
            default:
                break;
        }
    }

    // Handle icon types from config
    switch (config.icon) {
        case 'checkmark':
            return React.createElement(IoCheckmarkCircle, { style: { color: colors.SUCCESS } });
        case 'warning':
            return React.createElement(MdOutlinePending, { style: { color: '#f59e0b' } });
        case 'mail':
            return React.createElement(IoMail, { style: { color: colors.BLUE } });
        case 'close':
            return React.createElement(IoCloseCircle, { style: { color: colors.RED } });
        default:
            return React.createElement(IoCheckmarkCircle, { style: { color: colors.INFO } });
    }
};

export const useToast = () => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const addToastFromType = useCallback((type: string, data?: ToastData) => {
        const config = TYPE_CONFIGS;

        if (config) {
            const newToast: ToastItem = {
                id: `toast-${Date.now()}-${Math.random()}`,
                type: data?.type as ToastType || config[type as keyof typeof TYPE_CONFIGS]?.baseType,
                message: data?.type === 'message' ? data?.content : data?.message || config[type as keyof typeof TYPE_CONFIGS]?.message,
                title: data?.title || '',
                icon: getIconByType(type, data?.status),
                status: data?.status || '', 
                owner: config[type as keyof typeof TYPE_CONFIGS]?.baseType === 'message' ? data?.sender?.fullName : undefined,
                showTimestamp: true,
                timestamp: data?.updatedAt ? new Date(data.updatedAt).getTime() : Date.now(),
                orderStatus: config[type as keyof typeof TYPE_CONFIGS]?.baseType === 'order' ? data?.status as OrderStatus : undefined
            };
            // Replace all existing toasts with the new one (only show one toast at a time)
            setToasts([newToast]);
        }
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, []);

    return { addToastFromType, toasts, removeToast };
}