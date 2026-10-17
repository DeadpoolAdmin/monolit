export enum SmartDeviceAction {
    OPEN_CURTAIN = 'open-curtain',
    CLOSE_CURTAIN = 'close-curtain',
    OPEN_BLIND = 'open-blind',
    CLOSE_BLIND = 'close-blind',
    TEMPERATURE = 'temperature',
    MASTER_LIGHT = 'master-light',
    BED_LIGHT = 'bed-light',
    CORRIDOR_LIGHT = 'corridor-light',
    CLEAN_ROOM = 'clean-room',
    DO_NOT_DISTURB = 'do-not-disturb',
    AIR_CONDITIONING = 'air-conditioning',
    AIR_CONDITIONING_ON_OFF = 'air-conditioning-on-off',
    AIR_CONDITIONING_SPEED = 'air-conditioning-speed',
    AIR_CONDITIONING_TEMPERATURE = 'air-conditioning-temperature',
    AIR_CONDITIONING_HEATING = 'air-conditioning-heating',
    RENT = 'rent',
    LED = 'led',
}


export enum SmartDeviceType {
    airConditioning = 'air-conditioning',
    bedLight = 'bedLight',
    blind = 'blind',
    corridorLight = 'corridorLight',
    curtain = 'curtain',
    dnd = 'do-not-disturb',
    led = 'led',
    masterLight = 'masterLight',
    temperature = 'temperature',
}