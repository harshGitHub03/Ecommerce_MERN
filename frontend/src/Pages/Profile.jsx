import React, { useEffect, useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import UserDetails from '../Components/profile/subPages/UserDetails'
import Addresses from "../Components/profile/subPages/Addresses"
import { useDispatch, useSelector } from 'react-redux'
import { signOutUser, verifyAuthToken } from '../reduxToolkit/thunks/authThunks'
import SignoutPopup from "../Components/profile/subPages/SignoutPopup"

function Profile() {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [signOutPopupToggle, setSignOutPopupToggle] = useState(false)
  useEffect(() => {
    console.log(signOutPopupToggle)
  }, [signOutPopupToggle])
  const { user, isAuthenticated, loading } = useSelector((state) => state.authData);
  const name = user?.name || "Not Specified";
  const city = user?.city || "City Not specified!";


  useEffect(() => {
    dispatch(verifyAuthToken()); // Verify token on render profile
  }, [dispatch]);

  // Verify token & isAuthenticated on rendering PROFILE page
  useEffect(() => {
    // Wait for loading to finish before checking authentication status
    if (!loading && !isAuthenticated) {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className='relative'>

      {/* show hide sign out popup */}
      {signOutPopupToggle ?
        <SignoutPopup setSignOutPopupToggle={setSignOutPopupToggle} />
        : null}

      <header className='h-[30vh] shadow-md bg-[#c4c9e0] px-[8%]  flex justify-between'>
        <section className='h-full flex flex-col justify-center'>
          <p className='text-[3rem] font-[350] capitalize'>{name}</p>
          <p className='text-[2rem] font-[350] capitalize'>{city}</p>
        </section>
        <button onClick={(e) => { setSignOutPopupToggle(true); e.stopPropagation() }} class="h-fit px-6 mb-[3%] self-end font-semibold hover:bg-gray-400 hover:text-white text-gray-700 border-2 border-gray-500 active:bg-[#0c544f] active:text-white py-2">Sign out</button>
      </header>
      <main className='mx-[8%] mt-10 mb-6 flex max-sm:flex-col justify-between'>
        <nav className='shadow-md flex sm:flex-col bg-gray-200 text-[1.15rem] border-gray-300 sm:w-[27%] text-gray-800 border-[1.5px] h-fit  max-sm:mb-6'>
          {/* end property to only active when /profile not on subroutes */}
          <NavLink to="/profile" end className={({ isActive }) => `p-4 ${isActive ? "profile-active-navlink" : ""}`}>Profile</NavLink>

          <NavLink to="/profile/addresses" className={({ isActive }) => `p-4 ${isActive ? 'profile-active-navlink' : ''}`}>Addresses</NavLink>
          <NavLink to='/cart' className={({ isActive }) => `p-4 ${isActive ? 'profile-active-navlink' : ''}`}>Your Cart</NavLink>
        </nav>
        <Routes>
          <Route path='/' element={<UserDetails />}></Route>
          <Route path='/addresses' element={<Addresses />}></Route>
        </Routes>
      </main>
    </div >
  )
}

export default Profile