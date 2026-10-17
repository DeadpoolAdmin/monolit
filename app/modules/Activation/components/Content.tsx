import Loader from '@/shared/components/Loader/Loader'
import { useResolution } from '@hotel-smarters/resolution-hook'
import React from 'react'

const Content = React.memo(({ code }: { code: string }) => {

    const deviceType = useResolution().getDeviceType();

    return (
        <div className='activation__content'>
            <div className="activation__code">
                <h1 className='activation__title'>Activate New Device</h1>
                <ol className='activation__steps'>
                    <li>Open <strong>{deviceType === 'SIGNAGE' ? 'Digital Signage' : 'Room Devices'}</strong> → <strong>Devices</strong></li>
                    <li>Press <strong>"Enter code"</strong></li>
                    <li>Type code</li>
                    <li>Pick the {deviceType === 'SIGNAGE' ? 'screen' : 'room'}</li>
                    <li>Confirm activation</li>
                </ol>
                {
                    !code ? <Loader /> :

                        <span className='code__code'>{code ? code : ''}</span>
                }
            </div>

        </div>
    )
})

Content.displayName = 'Content'

export default Content