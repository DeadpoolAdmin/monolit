import { useGenerateUrl } from '@hotel-smarters/generatefileurl'
import React from 'react'

import dining_error from '@assets/smarters.png'

const ServiceInfoImage = ({ image }: { image: string }) => {

    const { getUrl } = useGenerateUrl(process.env.REACT_APP_API_HOST as string);

    return (
        <div className='info__image'>
            <img src={getUrl(image)} alt={image}
                onError={(e: any) => e.target.src = dining_error}
            />
        </div>
    )
}

export default ServiceInfoImage