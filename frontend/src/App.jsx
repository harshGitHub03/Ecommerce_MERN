import "./index.css"

import React, { useEffect, useState } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'

import Home from './Pages/Home'
import Blog from './Pages/Blog'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import About from './Pages/About'
import Contact from './Pages/Contact'
import Shop from './Pages/Shop'
import ProductDetail from './Pages/ProductDetail'
import Cart from './Pages/Cart'
import ErrorComp from './Components/Error&LoadingComponents/ErrorComp'
import ScrollToTop from './Components/ScrollToTop'
import { addToCart, decrementQuantity, incrementQuantity, removeFromCart } from './reduxToolkit/thunks/cartThunks'

import Profile from './Pages/Profile'

// react popup / toastify imports
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { verifyAuthToken } from './reduxToolkit/thunks/authThunks'
import Login from './Components/LoginPages.jsx/forms/Login'
import Registration from './Components/LoginPages.jsx/forms/Registration'
import { fetchTotalProducts } from './reduxToolkit/thunks/productsThunk'


function App() {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(verifyAuthToken())
    dispatch(fetchTotalProducts())
  }, [])

  return (
    <>
      {/* React docs component to NavLink page from top*/}
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='shop' element={<Shop />}></Route>
        <Route path='/blog' element={<Blog />}></Route>
        <Route path='/about' element={<About />}></Route>
        <Route path='/contact' element={<Contact />}></Route>
        <Route path='/cart' element={<Cart />}></Route>
        <Route path='/shop/:productId' element={<ProductDetail />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<Registration />}></Route>

        {/* for sub routes of profile page as well */}
        <Route path='/profile/*' element={<Profile />}></Route>

        {/* error page if trying to access wrong page on URL */}
        <Route path='*' element={<ErrorComp />}></Route>
      </Routes>
      <Footer />


      <ToastContainer
        position="bottom-left"
        autoClose={1000}
        hideProgressBar={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="light"
        transition:Bounce
        />
    </>
  )
}

export default App