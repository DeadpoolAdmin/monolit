export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
};

export const ROUTE_PATHS = {
    MAIN: '/',
    WELCOME: '/welcome',
    MENU: '/menu',
    VOD: '/menu/vod',
    SETTINGS: 'settings',
    ALARM: 'alarm',
    AIRPORTS: 'airports',
    APPLICATIONS: 'applications',
    INFOCENTER: 'infocenter',
    MESSAGES: 'messages',
    RADIO: 'radio',
    MUSIC: 'music',
    SERVICES: 'services',
    PRODUCTS: 'products',
    ROOM_CONTROL: 'roomcontrol',
    MY_ORDERS: '/myorders',
    ACTIVATION_MOBILE: '/activationMobile'
} as const;

export const CONTROL_EVENTS = {
    HEADER_DOWN_CONTROL: 'headerdowncontrol',
    LOST_INPUT_FOCUS: 'lostInputFocus',
    PROMOTION_CONTROL: 'promotionControl',
    PROMOTION_CLOSED: 'promotionClosed',
    HIDE_ICON: 'hideIcon',
    SHOW_ALARM_ICON: 'showAlarmIcon',
    REMOVE_ALARM_ITEM: 'removeAlarmItem',
    EMPTY_MOUNTED: 'EmptyMounted',
    ON_HEADER_CONTROL: 'onheadercontrol'
} as const;

export const STORAGE_KEYS = {
    MANY_WAREHOUSES: 'isManyWarehouses',
    DEVICE_INFO: 'deviceInfo',
    ALARM_DAYS: 'alarm-days',
    SERVICE_ID: 'serviceId',
    PREVIOUS_SERVICE_ID: 'previousServiceId'
} as const;
