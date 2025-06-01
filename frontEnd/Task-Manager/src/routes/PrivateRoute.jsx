import React from 'react'
import { Outlet } from 'react-router-dom'

const PrivateRoute = ({allowedRoles}) => {
  return <Outlet/> // forgeting  importing  this took me more time 
}

export default PrivateRoute