import React from 'react'
import { useSelector } from 'react-redux'
import { TABS } from '../types'
import Languages from './tabs/Languages'
import DeviceInfo from './tabs/DeviceInfo'
import WifiContent from './tabs/Wifi'

const ContentBody = () => {
    const activeTab = useSelector((state: any) => state?.tabs?.activeTab)

    return (
        <div className="settings__content__body" style={{
            height: '75rem'
        }}>
            {
                activeTab === TABS.LANGUAGE ? <Languages />
                    :
                    activeTab === TABS.DEVICE_INFO ? <DeviceInfo />
                        :
                        activeTab === TABS.WIFI_INFO ? <WifiContent />
                            :
                            <></>
            }
        </div>
    )
}

export default ContentBody