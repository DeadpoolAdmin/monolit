// Base interfaces for the order system

export interface Inventory {
    id?: number;
    name: string;
    image: string;
}

export interface Service {
    name: string;
    image: string;
    price: number;
}

export interface BaseItem {
    id: string;
    name?: string;
    price: number | string;
    image?: string;
    quantity?: number;
    type?: 'reservation' | string;
    status?: 'pending' | 'ready' | 'paid' | 'canceled' | 'finished' | 'accepted' | 'rejected';
    inventory?: Inventory;
}

export interface InventoryItem extends BaseItem {
    inventory?: Inventory;
    items?: InventoryItem[]; // For nested items in cart
}

export interface ReservationItem extends BaseItem {
    type: 'reservation';
    status: 'pending' | 'ready' | 'paid' | 'canceled' | 'finished' | 'accepted' | 'rejected';
    date: string;
    reservationFrom?: string;
    service?: Service;
}

export interface CartItem extends BaseItem {
    type?: 'reservation' | string;
    status: 'pending' | 'ready' | 'paid' | 'canceled' | 'finished' | 'accepted' | 'rejected';
    createdAt?: string;
    date?: string;
    reservationFrom?: string;
    reservedFrom?: string;
    totalAmount?: number;
    inventory?: Inventory;
    service?: Service;
    items?: InventoryItem[];
}

export interface Order {
    id: string;
    type?: 'reservation' | string;
    status: 'pending' | 'ready' | 'paid' | 'canceled';
    createdAt?: string;
    date?: string;
    reservationFrom?: string;
    items: CartItem[];
    totalAmount?: number;
    // Reservation-specific properties (when used as an item)
    name?: string;
    price: number | string; // Required when used as an item
    image?: string;
    quantity?: number;
    inventory?: Inventory;
}

export interface ReservationData {
    id: string;
    status: 'pending' | 'ready' | 'paid' | 'canceled';
    date: string;
    reservedFrom: string;
    service: Service;
}

// Union type for all possible item types
export type AnyItem = InventoryItem | ReservationItem | CartItem | Order;

// Props interfaces for components
export interface OrderListItemProps {
    item: AnyItem;
    style: React.CSSProperties;
    isActive: boolean;
    type: string;
    // items: CartItem[];
}

export interface OrderCartListItemProps {
    item: CartItem;
    style: React.CSSProperties;
    isActive: boolean;
    onClick: () => void;
}

export interface OrderCartListProps {
    type: string;
    orderData: CartItem[];
    reservationsData: ReservationData[];
    orderLoading: boolean;
    reservationLoading: boolean;
}
