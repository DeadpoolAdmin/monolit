import React from 'react'
import Tabs from './Tabs'
import ContentBody from './ContentBody'

const SettingsContent = () => {
    return (
        <div className='settings__content'>
            <Tabs />
            <ContentBody />
            {/* <Version /> */}
        </div>
    )
}

export default SettingsContent