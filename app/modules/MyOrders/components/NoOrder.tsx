import { useKeydown } from '@hotel-smarters/use-key-down-control';
import React, { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import basket from '@assets/basket.png';
import { useNavigate } from 'react-router-dom';
import { setRootControl } from '@/slices/RootControlSlice';
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL';

const NoOrder = React.memo(() => {

  const dispatch = useDispatch();

  const rootControl = useSelector((state: any) => state.rootControl.rootControl);

  const selectedTab = useSelector((state: any) => state.orderTab.selectedTab);

  const navigate = useNavigate();

  const handleUp = useCallback(() => {
    dispatch(setRootControl(ROOT_CONTROL.ORDER_TABS));
  }, [dispatch])

  const controls = useMemo(() => ({
    isActive: rootControl === ROOT_CONTROL.ORDER_CART,
    id: 'no_order',
    up: handleUp,
    back: () => {
      navigate('/menu');
    }
  }), [rootControl, handleUp])

  useKeydown(controls)

  return (
    <div className='no_order'>
      <div className="no_order__image">
        <img src={basket} alt="No orders" />
      </div>

      <div className="no_order__text">
        {
          selectedTab === 'inventories' ?
            <span>No order history to show.
              <br />
              Place an order to see it here!
            </span>

            :
            <span>
              You don't have any reservations yet. <br /> Add one to see it here!
            </span>
        }

      </div>
    </div>
  )
})

NoOrder.displayName = 'NoOrder'

export default NoOrder