import React from 'react'

import cast from '@assets/cast.png'

const CastCast = () => {
    return (
        <div className='cards__wifi'>
            <div className="cards_wifi__content">
                <div className="content__title">
                    <span className='number'>3.</span>
                    <span className='title'>Cast your content</span>
                </div>

                <div className="content__icon">
                    <img src={cast} alt="wifi" />
                </div>

                <div className="content__down_text" style={{
                    position: 'relative',
                    top: '-2rem'
                }}>
                    <div className="wifi__name">
                        <span className='key'> Open any streaming app </span>
                    </div>
                    <div className="wifi__password">
                        <span className='value'> Tap to cast icon</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CastCast