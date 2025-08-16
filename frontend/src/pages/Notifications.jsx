import React, { useEffect } from 'react'
import NotificationCard from '../components/NotificationCard'
import { useLocation } from "react-router-dom";
import { contactsStore } from '../store/contactsStore';

function Notifications() {
  const location = useLocation();

  const isOnNotificationsPage = location.pathname === "/notifications";
  const { getNotifications, notifications, unsubscribeFromNotifications, subscribeToNotifications } = contactsStore();
  useEffect(() => {
    if (isOnNotificationsPage) {
      getNotifications();
      subscribeToNotifications();
    }
    
    return () => {
      unsubscribeFromNotifications();
    }
  }, [getNotifications, isOnNotificationsPage, subscribeToNotifications, unsubscribeFromNotifications]);


  return (
    <div className='p-2'>
      <NotificationCard />
    </div>
  )
}

export default Notifications