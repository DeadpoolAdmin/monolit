import { useResolution } from "@hotel-smarters/resolution-hook";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const useChooseAirport = () => {
    const navigate = useNavigate();

    const { getDeviceType } = useResolution();

    const chooseAirport = useCallback((id: string | number, iata_code: string) => {
        const chosenAirports = [];

        chosenAirports.push(id);

        const existingAirports = JSON.parse(localStorage.getItem('chosenAirports') || '[]');
        const updatedAirports = [id, ...existingAirports];
        const uniqueAirports = updatedAirports.filter((airportId, index) =>
            updatedAirports.indexOf(airportId) === index
        );
        localStorage.setItem('chosenAirports', JSON.stringify(uniqueAirports));

        if (getDeviceType() === 'TV') {
            navigate(`flights?id=${id}&iata_code=${iata_code}`);
            return;
        }

        navigate(`flights?device=tablet&id=${id}&iata_code=${iata_code}`);
    }, [])

    return {
        chooseAirport
    }
}