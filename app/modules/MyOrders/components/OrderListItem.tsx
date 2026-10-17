import React, { useMemo } from 'react'

import order_error from '@assets/smarters.png'
import { useGenerateUrl } from '@hotel-smarters/generatefileurl';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useKeydown } from '@hotel-smarters/use-key-down-control';
import { OrderListItemProps } from '../types/order.interface';
import { useText } from '@/shared/hooks/useGetText';
import { setRootControl } from '@/slices/RootControlSlice';
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL';
import { SelectedTab } from '../types/selectedTab';
import { getWholeAndDecimal } from '../functions/getWholeAndDecimal';
import { useSearchParams } from 'react-router-dom';

const OrderListItem = ({ item, style, isActive }: OrderListItemProps) => {
    const { getUrl } = useGenerateUrl(process.env.REACT_APP_API_HOST as string);

    const { getText } = useText();

    const deviceInfoData = JSON.parse(localStorage.getItem('deviceInfo')! || '{}')

    const currency = deviceInfoData.organization?.currency?.symbol ? deviceInfoData.organization?.currency.symbol : '$'

    const language = useMemo(() => localStorage.getItem('lang') as string, []) || 'en';

    const selectedTab = useSelector((state: any) => state.orderTab.selectedTab)


    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');

    const dispatch = useDispatch();

    const onDown = () => {
        if (type === 'reservation' && item?.status === 'pending') {
            dispatch(setRootControl(ROOT_CONTROL.ORDER_POPUP_CANCEL))
        }
    }

    const controls = {
        isActive: isActive && type === 'reservation',
        id: 'order-control-id',
        down: () => {
            onDown();
        }
    }

    useKeydown(controls);
    return (
        <div className={`order__item ${isActive ? 'active' : ''}`} style={style}>
            <div className="order__image" style={{

            }}>
                <img onError={
                    (e: any) => e.target.src = order_error
                } className='order__image' src={getUrl(type === 'reservation' && 'service' in item ? item.service?.image : selectedTab === SelectedTab.INVENTORIES ? item?.inventory?.image : item?.image ? item?.image : order_error)} alt={item?.name ?? 'item'} />
            </div>
            <div className='order__text'>
                <div className='order__name'>
                    <span>
                        {getText(type === 'reservation' && 'service' in item ? item.service?.name || 'Item' : selectedTab === SelectedTab.INVENTORIES ? item?.inventory?.name || 'Item' : item?.name || 'Item', language) ?? 'Item'}
                    </span>

                </div>

                <div className='order__down_text'>
                    <span className='price'>
                        {
                            currency + " " + getWholeAndDecimal(type === 'reservation' && 'service' in item ? item.service?.price || 0 : item?.price || 0).whole

                        }

                        <sup>
                            {
                                getWholeAndDecimal(type === 'reservation' && 'service' in item ? item.service?.price || 0 : item?.price || 0).decimal > 0 ? '.' + getWholeAndDecimal(type === 'reservation' && 'service' in item ? item.service?.price || 0 : item?.price || 0).decimal : ''
                            }
                        </sup>

                    </span>
                </div>


            </div>


            <div className={`item__right ${selectedTab === SelectedTab.INVENTORIES ? 'inventories' : 'reservations'}`}>
                    {
                    
                    type !== 'reservation' &&
                    <div className="order__quantity" style={{marginTop: '1rem'}}>
                        <span> {type === 'reservation' ? item?.quantity : item?.quantity} </span>
                    </div>

                }

            </div>
        </div>
    )
}

export default OrderListItem