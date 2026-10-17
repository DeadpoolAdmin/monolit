import React from 'react'

import '@/shared/styles/Loader/loader.scss'

interface LoaderProps {
    style?: React.CSSProperties
}

const Loader = React.memo(({ style = {} }: LoaderProps) => {
    const loaderStyle = React.useMemo(() => ({ ...style }), [style])

    return (
        <div className="load__container">
            <div className='loader' style={loaderStyle}>
            </div>
        </div>

    )
})

Loader.displayName = 'Loader'

export default Loader