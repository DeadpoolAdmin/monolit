import React from 'react'
import WifiInfo from '../WifiInfo'
import WifiConnect from '../WifiContent'



const WifiContent = () => {
    return (
        <div className='settings__wifi-content'>
            <WifiInfo />
            <WifiConnect />
        </div>
    )
}

export default WifiContent