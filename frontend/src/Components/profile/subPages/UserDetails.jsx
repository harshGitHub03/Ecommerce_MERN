import React, { useEffect, useState } from 'react'
import EditUserDetails from './editSubPages/EditUserDetails'
import { useSelector } from 'react-redux';

function UserDetails() {
  //user details
  const { user } = useSelector((state) => state.authData)
  const name = user?.name || "not specified!";
  const email = user?.email || "not specified!"  
  const city = user?.city || "not specified!"
  const contact = user?.contact || "not specified!";
  const gender = user?.gender || "not specified!";
  const age = user?.age || "not specified!"

  //toggle between details and editDetails
  const [editButton, setEditButton] = useState(true);

  return (
    <main className='w-[69%] max-sm:w-full'>
      <p className='text-3xl font-extralist w-fit'>User Details{!editButton?"> Edit Details":null}</p>
      {
        editButton ?
          <main className='shadow-md my-6 px-7 flex flex-col border-[1.5px]'>
            <main className='flex'>

            <div className='w-1/2 mr-5'>
                <div className='mt-6'>
                  <p className='text-sm text-gray-600'>Name</p>
                  <p className='text-ellipsis overflow-hidden'>{name}</p>
                </div>
                <div className='mt-5'>
                  <p className='text-sm text-gray-600'>E-mail</p>
                  <p className='text-ellipsis overflow-hidden'>{email}</p>
                </div>
                <div className='my-5'>
                  <p className='text-sm text-gray-600'>City</p>
                  <p className='text-ellipsis overflow-hidden'>{city}</p>
                </div>
              </div>

              <div className='w-1/2 mr-5'>
                <div className='mt-6'>
                  <p className='text-sm text-gray-600'>Contact</p>
                  <p>{contact}</p>
                </div>
                <div className='mt-5'>
                  <p className='text-sm text-gray-600'>Gender</p>
                  <p>{gender}</p>
                </div>
                <div className='my-5'>
                  <p className='text-sm text-gray-600'>Age</p>
                  <p>{age}</p>
                </div>
              </div>
            </main>
            <div className='flex self-end pb-2'>
              <button onClick={() => setEditButton(!editButton)} class="h-fit mr-4 px-6 mb-[6.5%] w-fit font-semibold hover:bg-gray-400 hover:text-white text-white active:bg-[#0c544f] active:text-white py-2 bg-gray-600">Edit</button>
            </div>
          </main>

          : <EditUserDetails editButton={editButton} setEditButton={setEditButton} />
      }
    </main>
  )
}

export default UserDetails