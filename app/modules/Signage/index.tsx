import useSignageSocket from '@/shared/hooks/socket/useSignageSocket'
import React from 'react'
import { Outlet } from 'react-router'

const Signage = () => {

  useSignageSocket();

  return (
    <Outlet />
  )
}

export default Signage