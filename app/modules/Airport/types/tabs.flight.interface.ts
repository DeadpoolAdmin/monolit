export const TABS_FLIGHT = {
    DEPARTURES: 'Departures',
    ARRIVALS: 'Arrivals',
}

export type TabsFlight = typeof TABS_FLIGHT[keyof typeof TABS_FLIGHT];
