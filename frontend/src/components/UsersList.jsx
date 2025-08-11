import React from 'react'
import AddUsersCard from './addUsersCard'
import { useEffect } from 'react'
import { contactsStore } from '../store/contactsStore'

function UsersList() {

  const { getSuggestion, suggestionData } = contactsStore();

  useEffect(() => {
    getSuggestion();
  }, [])

  // console.log(suggestionData)

  return (
    <div className='flex flex-col gap-3 w-full no-scrollbar'>
      <span className='font-semibold text-yellow-500'>Recent Users..</span>
      {suggestionData &&
        suggestionData.map((user, index) => (
          <AddUsersCard key={user._id || index} users={user} />
        ))
      }
    </div>
  )
}

export default UsersList