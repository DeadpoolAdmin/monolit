import React, { useCallback, useMemo } from 'react'

import { useGenerateUrl } from '@hotel-smarters/generatefileurl'
import { useNavigate } from 'react-router-dom'

import dining_error from '@/assets/smarters.png'
import { useText } from '@/shared/hooks/useGetText';
import IInventory from '../types/inventory.interface';

interface InventoryItemProps {
    item: IInventory;
    isActive: boolean;
    style: React.CSSProperties;
}

const InventoryItem = React.memo<InventoryItemProps>(({ item, isActive, style }) => {

    const { getUrl } = useGenerateUrl(process.env.REACT_APP_API_HOST as string);
    const navigate = useNavigate();
    const { getText } = useText();

    const priceInfo = useMemo(() => {
        const [whole, decimal] = item?.unitPrice!.toString().split('.');
        return { whole, decimal };
    }, [item.unitPrice]);

    const deviceInfoData = JSON.parse(localStorage.getItem('deviceInfo')! || '{}')

    const currency = deviceInfoData.organization?.currency?.symbol ? deviceInfoData.organization?.currency.symbol : '$'

    const language = useMemo(() => localStorage.getItem('lang') as string, []);

    const itemName = useMemo(() =>
        getText(item.name, language).substring(0, 35),
        [getText, item.name, language]
    );

    const imageUrl = useMemo(() => getUrl(item.image), [getUrl, item.image]);

    const navigateDetail = useCallback(() => {
        navigate(`detail`);
        localStorage.setItem('serviceId', item.id.toString());
    }, [navigate, item.id]);

    const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.src = dining_error;
    }, []);

    return (
        <div onClick={navigateDetail} className={`inventory__item ${isActive ? 'active' : ''}`} style={style}>
            <div className="item__image">
                <img
                    onError={handleImageError}
                    src={imageUrl}
                    alt={item.name}
                />
            </div>

            <div className="item__text">
                <div className="item__name">
                    {itemName}
                </div>

                <div className="item__down_text">
                    <span className="price">
                        {currency + priceInfo.whole}
                        {priceInfo.decimal && (
                            <sup style={{ fontSize: '2rem' }}>
                                {'.' + priceInfo.decimal}
                            </sup>
                        )}
                    </span>
                </div>
            </div>
        </div>
    )
})

InventoryItem.displayName = 'InventoryItem'

export default InventoryItem