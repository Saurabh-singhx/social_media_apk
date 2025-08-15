import React, { useEffect } from 'react'
import NotificationCard from '../components/NotificationCard'
import { useLocation } from "react-router-dom";
import { contactsStore } from '../store/contactsStore';

function Notifications() {
  const location = useLocation();

  const isOnNotificationsPage = location.pathname === "/notifications";
    const { getNotifications } = contactsStore();
    useEffect(() => {
      if(isOnNotificationsPage) {
        getNotifications();
      }
    }, [])
    
  return (
    <div className='p-2'>
        <NotificationCard/>
    </div>
  )
}

export default Notifications