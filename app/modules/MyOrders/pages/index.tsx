import React from 'react'
import OrderCart from '../components/OrderCart'

const Orders = React.memo(() => {
    return (
        <OrderCart />
    )
})

Orders.displayName = 'Orders'

export default Orders