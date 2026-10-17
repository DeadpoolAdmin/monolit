export enum DeviceName {
    MASTER_LIGHT = 'masterLight',
    BED_LIGHT = 'bedLight',
    CORRIDOR_LIGHT = 'corridorLight',
    LED = 'led',
    DND = 'dnd',
    CURTAIN = 'curtain',
    BLIND = 'blind',
    AIR_CONDITIONING = 'air-conditioning',
    TEMPERATURE = 'temperature',
    DO_NOT_DISTURB = 'do-not-disturb',
    MAKE_UP_ROOM = 'make-up-room',
}

export enum Register {
    MASTER_LIGHT = 'master-light',
    BED_LIGHT = 'bed-light',
    CORRIDOR_LIGHT = 'corridor-light',
    LED = 'led',
    DND = 'dnd',
    CURTAIN = 'curtain',
    BLIND = 'blind',
    AIR_CONDITIONING_ON_OFF = 'air-conditioning-on-off',
    AIR_CONDITIONING_SPEED = 'air-conditioning-speed',
    AIR_CONDITIONING_TEMPERATURE = 'air-conditioning-temperature',
    AIR_CONDITIONING_HEATING = 'air-conditioning-heating',
    OPEN_CURTAIN = 'open-curtain',
    CLOSE_CURTAIN = 'close-curtain',
    OPEN_BLIND = 'open-blind',
    CLOSE_BLIND = 'close-blind',
    TEMPERATURE = 'temperature',
    MAKE_UP_ROOM = 'make-up-room',
}

export enum StatusRegister {
    TEMPERATURE = 'temperature',
    MASTER_LIGHT = 'master-light',
    BED_LIGHT = 'bed-light',
    CORRIDOR_LIGHT = 'corridor-light',
    LED = 'led',
    DND = 'dnd',
    CURTAIN = 'curtain',
    BLIND = 'blind',
    AIR_CONDITIONING_ON_OFF = 'air-conditioning-on-off',
    AIR_CONDITIONING_SPEED = 'air-conditioning-speed',
    AIR_CONDITIONING_TEMPERATURE = 'air-conditioning-temperature',
    AIR_CONDITIONING_HEATING = 'air-conditioning-heating',
    MAKE_UP_ROOM = 'make-up-room',
}

export enum RegisterType {
    ON_OFF = 'onOff',
    OPEN = 'open',
    CLOSE = 'close',
    COUNTER = 'counter',
    SPEED = 'speed',
    HEATING = 'heating',
    OPEN_CLOSE_STATUS = 'openCloseStatus',
    TEMPERATURE = 'temperature',
    MAKE_UP_ROOM = 'make-up-room',
}

export enum AddressValueType {
    BOOLEAN = 'boolean',
    INTEGER = 'integer',
}

// ==============================
// 🔷 FRONTEND DEVICE STRUCTURE
// ==============================

export interface IDeviceRegisterConfig {
    statusRegisterKey: StatusRegister | null;
    registerToAction: Register | null;
    valueType?: AddressValueType;
    icon?: string;
    iconActive?: string;
    min: number;
    max: number;
}

export type DeviceRegisterMap = Partial<Record<RegisterType, IDeviceRegisterConfig>>;

export interface IDeviceConfig extends DeviceRegisterMap {
    includes: RegisterType[];
    name: DeviceName;
    displayName: string;
    icon?: string;
    iconActive?: string;
    isVisible: boolean;
}

export type IDevicesMap = Record<DeviceName, IDeviceConfig>;

// ==============================
// 🔷 BACKEND STRUCTURE
// ==============================

export interface IDeviceAddress {
    smartDeviceAction: string; // corresponds to Register value
    register: string;
    statusRegister: string;
    addressType: AddressValueType | string;
    isReadable: boolean;
    isWritable: boolean;
    isImpulse: boolean;
    impulseDelay: number;
}

export interface IBackendDevice {
    name: DeviceName | string;
    displayName: string;
    visible: boolean;
    addresses?: IDeviceAddress[];
    metadata: Record<string, any>;
    image : string;
    status?: boolean;
    id?: number | string;
}

export type IDevicesFromBackend = IBackendDevice[];