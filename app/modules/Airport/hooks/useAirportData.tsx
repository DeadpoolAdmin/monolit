import { useGetAirportsQuery } from "@/services/Settings/SettingsApi";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Airport } from "../types/airport.interface";

export const useAirportData = () => {

    const countryFromLocalStorage = useMemo(() => {
        const deviceInfo = localStorage.getItem('deviceInfo');
        if(deviceInfo){
            const parsedInfo = JSON.parse(deviceInfo);
            return {
                country: parsedInfo.organization.country,
            };
        }
    }, [])

    const { data, isLoading } = useGetAirportsQuery({ country: countryFromLocalStorage ? countryFromLocalStorage.country : 'Portugal' });

    // const { data, isLoading } = useGetAirportsQuery({ country: 'Portugal' });

    const [loading, setLoading] = useState(false);

    const [airports, setAirports] = useState<Airport[] | null>(null);

    useEffect(() => {
        if(isLoading) {
            setLoading(true)
        }
        else {
            setLoading(false)
        }
    }, [isLoading])

    const mapAirports = useCallback((response: Airport[]) => {
        const mapped = response.map((airport) => ({
            id: airport.id,
            airport_id: airport.airport_id,
            airport_name: airport.airport_name,
            city_iata_code: airport.city_iata_code,
            country_iso2: airport.country_iso2,
            country_name: airport.country_name,
            geoname_id: airport.geoname_id,
            gmt: airport.gmt,
            iata_code: airport.iata_code,
            icao_code: airport.icao_code,
            latitude: airport.latitude,
            longitude: airport.longitude,
            phone_number: airport.phone_number,
            timezone: airport.timezone
        }));

        // Get chosen airports from localStorage
        const chosenAirportsString = localStorage.getItem('chosenAirports');
        const chosenAirportIds: string[] = chosenAirportsString ? JSON.parse(chosenAirportsString) : [];

        // Create chosen airports array in the same order as localStorage (most recent first)
        const chosenAirports: Airport[] = [];
        chosenAirportIds.forEach(chosenId => {
            const foundAirport = mapped.find(airport => 
                airport.id === chosenId || airport.airport_id === chosenId
            );
            if (foundAirport) {
                chosenAirports.push(foundAirport);
            }
        });
        
        // Get airports that are not in the chosen list
        const otherAirports = mapped.filter(airport => 
            !chosenAirportIds.includes(airport.id) && !chosenAirportIds.includes(airport.airport_id)
        );

        // Put chosen airports first (in localStorage order), then other airports
        const sortedAirports = [...chosenAirports, ...otherAirports];

        setAirports(sortedAirports);

        setLoading(false)
    }, []);


    useEffect(() => {
        if(data) {
            mapAirports(data as Airport[]);
        }
    }, [data])

    return {
        airports,
        isLoading,
        loading
    }
}