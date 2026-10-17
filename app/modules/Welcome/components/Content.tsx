
import React from 'react'
import WelcomeContentQrCode from './QrCode';
import Weather from '@/shared/components/Weather/Waether';

const WelcomeContent = () => {
        return (
        <div className='welcome__content'>
            
            <WelcomeContentQrCode  />
                
    
            <Weather />

        </div>
    )
}

export default WelcomeContent