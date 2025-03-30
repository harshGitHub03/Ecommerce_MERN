import React, { useState } from 'react'
import EditAddresses from './editSubPages/EditAddresses';
import { useSelector } from 'react-redux';

function Adresses() {
  const { addresses } = useSelector((state) => state.authData?.user || {});
  const [editAddressesToggle, setEditAddressesToggle] = useState(false);

  return (
    <main className='w-[69%] max-sm:w-full'>
      <p className='text-3xl font-normal text-gray-800 w-fit'>Addresses{editAddressesToggle ? ">Edit Addresses" : ""}</p>
      {!editAddressesToggle ?

        <main className='shadow-md my-6 px-7 flex flex-col border-[1.5px]'>
          <main>
            {addresses && addresses.length > 0 ?
              addresses.map((element, i) => {
                return (
                  <div className='mt-6'>
                    <p className='text-sm text-gray-600'>Address {i + 1}:</p>
                    <p>{element}</p>
                  </div>
                )
              })
              : <div className='my-6'>
                <p className='text-sm text-red-600 my-2'>No Address registered yet!</p>
              </div>
            }
          </main>
          <button onClick={() => setEditAddressesToggle((prev) => !prev)} class="h-fit self-end px-6 mb-[3%] w-fit font-semibold hover:bg-gray-400 hover:text-white text-gray-700 border-2 border-gray-500 active:bg-[#0c544f] active:text-white py-2">Edit</button>
        </main>
        : <EditAddresses setEditAddressesToggle={setEditAddressesToggle} />
      }
    </main>
  )
}

export default Adresses