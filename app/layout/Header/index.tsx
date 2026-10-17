import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import DateSection from './components/DateSection/DateSection'

import './index.scss'
import HeaderContent from './components/Content/Content'

import { useSelector } from 'react-redux'

const Header = React.memo(() => {

  const location = useLocation();

  const branding = useSelector((state: any) => state.branding.branding)

  const deviceInfo = useSelector((state: any) => state.deviceInfo.deviceInfo)

  return (
    branding && deviceInfo &&
    <div className='main'>
        <HeaderContent
            location={location}
            logo={branding?.logo}
            isBackActive={false}
            isEmptyAlive={false}
            currentControl={null}
            setIsBackActive={() => {}}
            setCurrentControl={() => {}}
            clickBack={() => {}}
        />
        {!location.pathname.includes('player') && <DateSection roomNumber={deviceInfo?.room?.number || 0} />}
        <Outlet />
    </div>
  )
})

export default Header