import React from 'react'

import wifi from '@assets/wifi.png'
import { useSelector } from 'react-redux';

const CardsWifi = () => {

    const settingsData = useSelector((state: any) => state.settingsData.settingsData);

    return (
        settingsData &&
        <div className='cards__wifi'>
            <div className="cards_wifi__content">
                <div className="content__title">
                    <span className='number'>1.</span>
                    <span className='title'>Connect your Wi-Fi</span>
                </div>

                <div className="content__icon">
                    <img src={wifi} alt="wifi" />
                </div>

                <div className="content__down_text">
                    <div className="wifi__password">
                        <span className='key'> SSID:  </span>
                        <span className='value'> {settingsData.wifiSsid} </span>
                    </div>
                    <div className="wifi__password">
                        <span className='key'> Password:  </span>
                        <span className='value'> {settingsData.wifiPassword} </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardsWifi