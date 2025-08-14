import React, { useState } from 'react'
import AddUsersCard from './addUsersCard'
import { useEffect } from 'react'
import { contactsStore } from '../store/contactsStore'
import { Search } from 'lucide-react';
import { HashLoader } from 'react-spinners';

function UsersList() {

  const { getSuggestion, suggestionData,searchedUser,searchContact,isSearchingUser } = contactsStore();
  const [enteredSearchedId, setEnteredSearchedId] = useState("")

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!enteredSearchedId.trim()) return;

    await searchContact({searchedId:enteredSearchedId});
    setEnteredSearchedId("");
  };

  useEffect(() => {
    getSuggestion();
  }, [])

  if (isSearchingUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <HashLoader color={"#f8e513"} size={40} />
      </div>
    )
  }


  return (
    <div className='flex flex-col gap-3 w-full no-scrollbar'>

      {/* Search Bar */}
      <div className="flex items-center bg-gray-100 mx-4 px-3 py-2 rounded-full shadow-sm">
        <input
          value={enteredSearchedId}
          onChange={(e) => setEnteredSearchedId(e.target.value)}
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none text-sm text-yellow-700 placeholder-gray-400 w-full font-semibold"
        />

        <button
        onClick={handleSearch}
        >
          <Search className='text-yellow-300' />
        </button>
      </div>
      {
        searchedUser && searchedUser.length > 0 ?(<span className='font-semibold text-yellow-500'>Searched Users..</span>):(<span className='font-semibold text-yellow-500'>Recent Users..</span>)
      }
      {
        searchedUser && searchedUser.length > 0 ? (
          searchedUser.map((user) => (  
            <AddUsersCard key={user._id} users={user} />
          ))
        ) : (
          suggestionData.map((user) => (
            <AddUsersCard key={user._id} users={user} />
          ))
        )
      }
    </div>
  )
}

export default UsersList