import QueryWrapper from '@/shared/components/QueryWrapper';
import React, { memo } from 'react'
import { useFlights } from '../hooks/useFlightData';
import FlightTabs from './FlightTabs';
import FlightTable from './FlightTable';


const FlightContent = () => {
  const { paginatedArrivals, paginatedDepartures, flightLoading, departureLoading, handleNextPage, handlePrevPage, currentPage } = useFlights();

  return (
    <QueryWrapper
      isLoading={flightLoading || departureLoading}
      isEmpty={!paginatedArrivals.length && !paginatedDepartures.length}
    >
      <div className="flight__header">
        <FlightTabs />
      </div>

      <FlightTable
        isLoading={flightLoading || departureLoading}
        arrivals={paginatedArrivals}
        departures={paginatedDepartures}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        currentPage={currentPage}
      />
    </QueryWrapper>
  )
}

export default memo(FlightContent)

