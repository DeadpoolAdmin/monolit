import { useGenerateUrl } from '@hotel-smarters/generatefileurl'
import { useResolution } from '@hotel-smarters/resolution-hook'
import React from 'react'

import 'smarters-ino-ui-tv/dist/main.css'
import { Application } from '../types/application.types'


type PApplicationsListItem = {
    item : Application,
    style : React.CSSProperties,
    isActive : boolean,
    openApp: (item : Application) => void
}

const ApplicationsListItem : React.FC<PApplicationsListItem> = ( { item, style, isActive, openApp } ) => {


    const { getUrl } = useGenerateUrl(process.env.REACT_APP_API_HOST!);

    const {getDeviceType} = useResolution();

    const deviceType = getDeviceType();

  return (
    <div className={`applications__list__item ${isActive && deviceType === 'TV' ? 'active' : ''}`} onClick={() => openApp(item)} style={style}>

        <div className="list__item__image">
            <img src={getUrl(item.coverImage)} alt={item.title} />
        </div>
    </div>
  )
}

export default ApplicationsListItem