import React, { memo } from 'react'

import tv from '@assets/tv.png'
import { useText } from '@/shared/hooks/useGetText'; 
import { useGenerateUrl } from '@hotel-smarters/generatefileurl';
import { IMenuList } from '../types/MenuProps'; 


type PMenuListItem = {
    title: string | Record<string, string>
    icon: string
    isActive: boolean
    style: React.CSSProperties
    item: IMenuList
    onOk: (item: IMenuList) => void
    unreads: number
}


const MenuListItem = memo(({ icon, title, isActive, style, item, onOk, unreads }: PMenuListItem) => {
    const lang = localStorage.getItem('lang') as string;

    const { getText } = useText();

    const { getUrl } = useGenerateUrl(process.env.REACT_APP_API_HOST || '');

    return (
        <div className={`menu_list__menu_item ${isActive ? 'active' : ''}`} style={{
            ...style,
            opacity: isActive ? 1 : 0.6,
        }} onClick={() => onOk(item)}>
            <img src={getUrl(icon)} onError={(e: any) => { e.target.src = tv }} />
            {
                unreads > 0 && item.type?.toLowerCase().includes('notification') && (
                    <div className="menu_item__unreads">
                        <span>{unreads > 9 ? '9+' : unreads}</span>
                    </div>
                )
            }
            <div className="menu_item__text">
                <span style={{ fontSize: '3rem', }}>{getText(title, lang)}</span>
            </div>

        </div>
    )
})

export default MenuListItem