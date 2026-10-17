import { useCallback, useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Flight, FlightTableData, UseFlightsReturn } from "../types/flight.interface";
import { useGetFlightsQuery } from "@/services/Settings/SettingsApi";
import { useResolution } from "@hotel-smarters/resolution-hook";

export const useFlights = (): UseFlightsReturn => {
    const location = useLocation();

    const arr_iata = new URLSearchParams(location.search).get('iata_code') || '';

    const { data, refetch, isLoading } = useGetFlightsQuery(arr_iata);

    const [arrivals, setArrivals] = useState<FlightTableData[]>([]);
    const [departures, setDepartures] = useState<FlightTableData[]>([]);

    const [flightLoading, setFlightLoading] = useState<boolean>(true);

    const [departureLoading, setDepartureLoading] = useState<boolean>(true);



    const { getDeviceType } = useResolution();
    const deviceType = getDeviceType();

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = useMemo(() => deviceType === 'TV' ? 7 : 1000, [deviceType]);

    const updateFlights = useCallback((newFlights: Flight[]) => {

        setFlightLoading(true);

        const formattedFlights = newFlights.map(flight => ({
            time: new Date(flight.flight_date).toLocaleDateString(),
            destination: flight.arrival.airport,
            flight: `${flight.airline?.iata || 'N/A'} ${flight.flight?.number || 'N / A'}`,
            gate: flight.departure.gate || 'N/A',
            remarks: flight.flight_status,
            arrival_time: new Date(flight.arrival.actual || flight.arrival.estimated || flight.arrival.scheduled).toLocaleTimeString(),
            departure_time: new Date(flight.departure.actual || flight.arrival.estimated || flight.departure.scheduled).toLocaleTimeString()
        }));

        setArrivals(formattedFlights);

        setFlightLoading(false);

    }, []);

    const updateDeparture = useCallback((newDepartures: Flight[]) => {

        setDepartureLoading(true);

        const formatedDepartures = newDepartures.map(flight => ({
            time: new Date(flight.flight_date).toLocaleDateString(),
            destination: flight.departure.airport,
            flight: `${flight.airline.iata} ${flight.flight.number}`,
            gate: flight.departure.gate || 'N/A',
            remarks: flight.flight_status,
            arrival_time: new Date(flight.arrival.actual || flight.arrival.estimated || flight.arrival.scheduled).toLocaleTimeString(),
            departure_time: new Date(flight.departure.actual || flight.arrival.estimated || flight.departure.scheduled).toLocaleTimeString()
        }))

        setDepartures(formatedDepartures);
        setDepartureLoading(false);
    }, []);

    // Pagination functions
    const paginatedArrivals = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return arrivals.slice(startIndex, endIndex);
    }, [arrivals, currentPage, itemsPerPage]);

    const paginatedDepartures = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return departures.slice(startIndex, endIndex);
    }, [departures, currentPage, itemsPerPage]);

    // Pagination info
    const totalArrivalsPages = Math.ceil(arrivals.length / itemsPerPage);
    const totalDeparturesPages = Math.ceil(departures.length / itemsPerPage);

    // Auto-pagination functions
    const handleNextPage = useCallback(() => {
        if (currentPage < Math.max(totalArrivalsPages, totalDeparturesPages)) {
            setCurrentPage(prev => prev + 1);
        }
    }, [currentPage, totalArrivalsPages, totalDeparturesPages]);

    const handlePrevPage = useCallback(() => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    }, [currentPage]);

    useEffect(() => {
        if (data) {
            updateFlights(data);
            updateDeparture(data);
        }
    }, [data])

    useEffect(() => {
        // Remove spin when loading is complete (regardless of data state)
        if (!isLoading) {
            const refresh__icon = document.querySelector('.refresh__icon');

            if (refresh__icon && refresh__icon.classList.contains('spin')) {
                refresh__icon.classList.remove('spin');
            }
        }
    }, [isLoading])

    useEffect(() => {
        if (data) {
            const refresh__icon = document.querySelector('.refresh__icon');


            if (refresh__icon && refresh__icon.classList.contains('spin')) {
                refresh__icon.classList.remove('spin');
            }
        }
    }, [data])

    return {
        arrivals,
        departures,
        refetch,
        setArrivals,
        setDepartures,
        updateFlights,
        updateDeparture,
        // Pagination data
        paginatedArrivals,
        paginatedDepartures,
        // Pagination info
        currentPage,
        itemsPerPage,
        totalArrivalsPages,
        totalDeparturesPages,
        // Auto-pagination functions
        handleNextPage,
        handlePrevPage,
        flightLoading,
        departureLoading
    }
}