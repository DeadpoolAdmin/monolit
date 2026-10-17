import { TABS } from '../types';
import React, { memo } from 'react'
import { useSelector } from 'react-redux';
import { useTabControl } from '../hooks/useTabControl';
import { useTabs } from '../hooks/useTabs';
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL';
import { useResolution } from '@hotel-smarters/resolution-hook';
import { useTranslate } from '@/shared/hooks/languages/useI18';

const Tabs = () => {
    const { index, setIndex } = useTabControl();

    const { onClickLanguages, onClickDeviceInfo, onClickWifiInfo } = useTabs(setIndex)

    const rootControl = useSelector((state: any) => state.rootControl.rootControl)

    const activeTab = useSelector((state: any) => state.tabs.activeTab)

    const deviceType = useResolution().getDeviceType();

    const { t } = useTranslate();

    return (
        <div className='settings__top'>
            <div className="tab__content">
                <div className={`language__option ${deviceType === 'TV' && rootControl === ROOT_CONTROL.SETTINGS_HEADER && index === 0 ? 'active' : ''} ${activeTab === TABS.LANGUAGE ? 'selected' : ''}`} onClick={onClickLanguages}>
                    <span>{t('language')}</span>
                </div>
                <div className={`wifi_info__option ${deviceType === 'TV' && rootControl === ROOT_CONTROL.SETTINGS_HEADER && index === 1 ? 'active' : ''} ${activeTab === TABS.WIFI_INFO ? 'selected' : ''}`} onClick={onClickWifiInfo}>
                    <span>{t('wi-fiInfo')}</span>
                </div>
                <div className={`device_info__option ${deviceType === 'TV' && rootControl === ROOT_CONTROL.SETTINGS_HEADER && index === 2 ? 'active' : ''} ${activeTab === TABS.DEVICE_INFO ? 'selected' : ''}`} onClick={onClickDeviceInfo}>
                    <span>{t('deviceInfo')}</span>
                </div>
            </div>
        </div>
    )
}

export default memo(Tabs) 