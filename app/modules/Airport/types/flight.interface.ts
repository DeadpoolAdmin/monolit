export interface FlightResponse {
    pagination: Pagination;
    data: Flight[];
}

export interface Pagination {
    limit: number;
    offset: number;
    count: number;
    total: number;
}

export interface Flight {
    flight_date: string;
    flight_status: string;
    departure: FlightEndpoint;
    arrival: FlightEndpoint;
    airline: Airline;
    flight: FlightInfo;
    aircraft: Aircraft | null;
    live: LiveData | null;
}

export interface FlightEndpoint {
    airport: string;
    timezone: string;
    iata: string;
    icao: string;
    terminal: string | null;
    gate: string | null;
    delay: number | null;
    scheduled: string;
    estimated: string | null;
    actual: string | null;
    estimated_runway: string | null;
    actual_runway: string | null;
    baggage?: string | null; // Optional, only exists on arrival
}

export interface Airline {
    name: string;
    iata: string;
    icao: string;
}

export interface FlightInfo {
    number: string;
    iata: string;
    icao: string;
    codeshared: Codeshared | null;
}

export interface Codeshared {
    airline_name: string;
    airline_iata: string;
    airline_icao: string;
    flight_number: string;
    flight_iata: string;
    flight_icao: string;
}

export interface Aircraft {
    registration: string;
    iata: string;
    icao: string;
    icao24: string;
}

export interface LiveData {
    updated: string;
    latitude: number;
    longitude: number;
    altitude: number;
    direction: number;
    speed_horizontal: number;
    speed_vertical: number;
    is_ground: boolean;
}

export interface FlightTableData {
    time: string;
    destination: string;
    flight: string;
    gate: string;
    remarks: string;
    arrival_time: string | null;
    departure_time: string;
}

export interface UseFlightsReturn {
    arrivals: FlightTableData[];
    departures: FlightTableData[];
    refetch: () => void;
    flightLoading: boolean;
    departureLoading: boolean;
    setArrivals: (arrivals: FlightTableData[]) => void;
    setDepartures: (departures: FlightTableData[]) => void;
    updateFlights: (newFlights: Flight[]) => void;
    updateDeparture: (newDepartures: Flight[]) => void;
    // Pagination data
    paginatedArrivals: FlightTableData[];
    paginatedDepartures: FlightTableData[];
    // Pagination info
    currentPage: number;
    itemsPerPage: number;
    totalArrivalsPages: number;
    totalDeparturesPages: number;
    // Auto-pagination functions
    handleNextPage: () => void;
    handlePrevPage: () => void;
}
