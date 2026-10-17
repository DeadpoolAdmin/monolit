import React, { memo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useTabs } from '../hooks/useFlightTabs';
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL';
import { TABS_FLIGHT, TabsFlight } from '../types/tabs.flight.interface';
import { useTabsControl } from '../hooks/useTabsControl';
import { useTranslate } from '@/shared/hooks/languages/useI18';
const FlightTabs = () => {
  const tabs = useSelector((state: any) => state.flightTab.activeTab);

  const { onSetActiveTab } = useTabs();

  const rootControl = useSelector((state: any) => state.rootControl.rootControl);

  const { index, setIndex } = useTabsControl();

  const { t } = useTranslate();

  const handleTabClick = useCallback((tab: TabsFlight, tabIndex: number) => {
    onSetActiveTab(tab, tabIndex, setIndex);
    setIndex(tabIndex);
  }, [onSetActiveTab, setIndex]);


  return (
    tabs &&
    <div className={`flight__tabs`}>
      <div className={`flight__tab ${tabs === TABS_FLIGHT.ARRIVALS ? 'selected' : ''} ${rootControl === ROOT_CONTROL.FLIGHT_TABS && index == 0 ? 'active' : ''}`} onClick={() => handleTabClick(TABS_FLIGHT.ARRIVALS, 0)}>
        <span>{t('arrivals')}</span>
      </div>
      <div className={`flight__tab ${tabs === TABS_FLIGHT.DEPARTURES ? 'selected' : ''} ${rootControl === ROOT_CONTROL.FLIGHT_TABS && index == 1 ? 'active' : ''}`} onClick={() => handleTabClick(TABS_FLIGHT.DEPARTURES, 1)}>
        <span>{t('departures')}</span>
      </div>
    </div>
  )
}

export default memo(FlightTabs) 