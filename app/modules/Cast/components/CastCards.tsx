import React from 'react'
import CardsQr from './Cards.qr'
import CastCast from './Cast.cast'
import CardsWifi from './Cards.wifi'

const CastCards = () => {
    return (
        <div className='cast__cards'>
            <CardsWifi />
            <CardsQr />
            <CastCast />
        </div>
    )
}

export default CastCards