interface AvailableHour {
    open: string;
    close: string;
}

interface AvailableHours {
    [day: string]: AvailableHour[];
}


export interface IQuickMessage {
    _id : string;
    message : string;
}

export interface IMessage {
    sender: string | number;
    translatedText: string;
    media: string[] | null;
    session: string | null;
    content: string;
    type: string;
    isRead: boolean;
    createdAt: string;
    departmentUnitId: IDpeartments;
    updatedAt: string;
    guestId: string;
    _id: string;

}

export interface IGuest {
    _id: string;
    fullName: string;
    orgId: number;
    remoteId: string;
    type: string;
    online: boolean;
    roomId: string;
    roomNumber: string;
    createdAt: string;
    updatedAt: string
}

export interface IDepartmentInfo {
    id: any;
    createdAt: string;
    departmentUnitId: IDpeartments;
    departmentUnitStaff: string[];
    guest: IGuest;
    messages: IMessage[];
    floor: number;
    isActive: boolean;
    orgId: number;
    remoteId: string;
    type: string;
    updatedAt: string;
    _id: string
    guestUnreadCount: number
}

export interface IDpeartments {
    _id: string;
    id: string;
    orgId: number;
    departmentId: number;
    name: string;
    description: string | null;
    floor: number;
    image: string;
    isActive: boolean;
    type: string;
    availableDays: string[] | null;
    availableHours: AvailableHours | null;
    departmentInfo: IDepartmentInfo;
}
