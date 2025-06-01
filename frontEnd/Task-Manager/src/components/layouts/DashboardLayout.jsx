import React, { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import SideMenu from './SideMenu'
import Navbar from './Navbar'
import Sidebar from './SideMenu'

const DashboardLayout = ({children,activeMenu}) => {
    const {user} =useContext(UserContext)
  return (
    <div className='flex h-screen bg-gray-50/50'>
      <Sidebar activeMenu={activeMenu}/>
      <div className='flex-1 overflow-auto'>
        <div className='min-w-[800px] px-6'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout