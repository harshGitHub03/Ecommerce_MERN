import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux';
import { signOutUser, verifyAuthToken } from '../../../reduxToolkit/thunks/authThunks';
import { useNavigate } from 'react-router-dom';

function signoutPopup({ setSignOutPopupToggle }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    //hide scrollbars on poup
    useEffect(() => {
        document.body.style.overflowY = "hidden";
        return () => document.body.style.overflowY = "auto";
    })

    //handle signOut thunk dispatch
    const handleSignOut = () => {
        dispatch(signOutUser(navigate));
    }

    //close Popup
    const ref = useRef();
    useEffect(() => {
        const hander = (e) => {
            if (!ref.current.contains(e.target))
                setSignOutPopupToggle(false)
        }
        document.body.addEventListener("click", hander)
        return () => document.body.removeEventListener("click", hander)
    }, [])

    return (
        <div className='h-screen w-screen bg-[#00000091] top-0 z-20 flex justify-center items-center fixed'>
            <div ref={ref} className='font-medium relative bg-white w-fit h-fit p-5 pb-0 flex justify-between flex-col w-[30%]'>

                {/* close signup CROSS */}
                <div className='absolute top-1 right-3'><i onClick={()=>setSignOutPopupToggle(false)} class="fa-solid fa-xmark p-2 hover:text-red-600 active:text-red-700 rounded-full"></i></div>

                <div className='mb-5 flex items-center flex-col'>
                    <i class="fa-solid fa-right-from-bracket text-5xl bg-green-600 rounded-full p-3 mb-2 text-white"></i>
                    <p className='text-4xl'>Sign out ?</p>
                    <p className='mt-1'>Are you sure you want to sign out?</p>
                </div>
                <div className='pb-2 flex justify-center'>
                    <button type='button' onClick={() => setSignOutPopupToggle(false)} class="h-fit mr-4 px-6 mb-[3%] w-fit font-semibold hover:bg-gray-400 hover:text-white text-white active:bg-[#0c544f] active:text-white py-2 bg-gray-600">Cancel</button>
                    <button onClick={() => handleSignOut()} type='submit' class="h-fit  px-6  w-fit font-semibold hover:bg-gray-400 hover:text-white text-gray-700 active:bg-[#0c544f] active:text-white py-2 bg-red-600 text-white">Sign Out</button>
                </div>
            </div>
        </div>
    )
}

export default signoutPopup