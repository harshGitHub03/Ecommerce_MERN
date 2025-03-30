import React, { useEffect, useRef, useState } from 'react'
import logo from '/logo.png'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, incrementQuantity } from '../reduxToolkit/thunks/cartThunks'
import { verifyAuthToken } from '../reduxToolkit/thunks/authThunks'

function Navbar() {
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.authData);
    const { cart } = useSelector(state => state.cartData);

    // on responsive lg(900px) hamburger icon
    const [hamburger, setHamburger] = useState(false)

    // click navbar to close on mobile devices
    const ref = useRef()
    useEffect(() => {
        const handler = (e) => {
            // ref.cuurent.contains() to know if click is inside navBar to close
            if (ref.current && ref.current.contains(e.target) || !ref.current.contains(e.target)) {
                setHamburger(false)
            }
        }
        document.body.addEventListener('click', handler)
    })


    return (<>
        <nav className='sticky top-0 flex justify-between items-center w-full bg-[#E3E6F3] py-1 lg:px-[8vw] z-10 shadow-lg min-h-[56px]'>
            <Link to='/' className='flex jusitfy-center items-center'><img src={logo} className='w-90 max-lg:ml-14 object-contain w-fit' alt="logo" /></Link>

            {/* use ref navbar to get ref.current.contain to get to know if clicked inside navbar / onNavlinks as well*/}
            <ul ref={ref} className={`${hamburger ? 'max-lg:top-[3rem]' : 'max-lg:top-[-490px]'} max-lg:shadow-xl max-lg:z-[-2] max-lg:duration-200 max-lg:bg-[#E3E6F3] max-lg:pt-8 max-lg:pb-5 max-lg:pt-6 flex max-lg:flex-col max-lg:absolute max-lg:w-full  lg:gap-7 items-center text-xl  font-medium`}>
                <NavLink to='/' className={`${hamburger ? "max-lg:w-full max-lg:py-3 max-lg:hover:bg-gray-300 flex max-lg:justify-center" : ""} relative hover:text-[#008000f5] px-[5px] py-[5px]`}>Home</NavLink>
                <NavLink to='/shop' className={`${hamburger ? "max-lg:w-full max-lg:py-3 max-lg:hover:bg-gray-300 flex max-lg:justify-center" : ""} relative hover:text-[#008000f5] px-[5px] py-[5px]`}>Shop</NavLink>
                <NavLink to='/blog' className={`${hamburger ? "max-lg:w-full max-lg:py-3 max-lg:hover:bg-gray-300 flex max-lg:justify-center" : ""} relative hover:text-[#008000f5] px-[5px] py-[5px]`}>Blog</NavLink>
                <NavLink to='/about' className={`${hamburger ? "max-lg:w-full max-lg:py-3 max-lg:hover:bg-gray-300 flex max-lg:justify-center" : ""} relative hover:text-[#008000f5] px-[5px] py-[5px]`}>About</NavLink>
                <NavLink to='/contact' className={`${hamburger ? "max-lg:w-full max-lg:py-3 max-lg:hover:bg-gray-300 flex max-lg:justify-center" : ""} relative hover:text-[#008000f5] px-[5px] py-[5px]`}>Contact</NavLink>
                <NavLink to="/login" onClick={(e) => e.stopPropagation()} className={`${hamburger ? "max-lg:w-full max-lg:py-3 max-lg:hover:bg-gray-300 flex max-lg:justify-center" : ""} lg:hidden relative hover:text-[#008000f5] px-[5px] py-[5px]`}>Login</NavLink>
                {/* <NavLink to='/shop' className='relative hover:text-[#008000f5] px-[5px] py-[3px]'></NavLink>
                <NavLink to='/blog' className='relative hover:text-[#008000f5] px-[5px] py-[3px]'>Blog</NavLink>
                <NavLink to='/about' className='relative hover:text-[#008000f5] px-[5px] py-[3px]'>About</NavLink>
                <NavLink to='/contact' className='relative hover:text-[#008000f5] px-[5px] py-[3px]'>Contact</NavLink>
                <Link to="/login" onClick={(e) => e.stopPropagation()} className='relative lg:hidden  hover:text-blue-800 font-semibold text-xl'>Login</Link> */}
            </ul>
            <div className='max-lg:mr-14 flex items-center h-fit'>
                {/* This ensures the click event of login popup doesn't close it */}
                <Link to="/login" onClick={(e) => e.stopPropagation()} className='relative max-lg:hidden hover:text-blue-800 font-semibold px-[5px] py-[3px] mr-2 text-xl'>Login</Link>
                <div className='text-3xl lg:hidden mr-2'>
                    {
                        hamburger ?
                            <i onClick={() => setHamburger(false)} className="fa-solid fa-xmark text-3xl p-2"></i>
                            : <i onClick={(e) =>{ setHamburger(true);e.stopPropagation()}} className="fa-solid fa-bars p-2"></i>
                    }
                </div>
                {isAuthenticated ? <> <Link to="/profile" className='p-2 hover:text-green-700'><i className="fa-solid fa-circle-user  text-[1.8rem] "></i></Link>
                    <NavLink to='/cart' className="fa-solid fa-cart-shopping relative text-3xl hover:text-green-700 p-2 pl-1 ml-2"><p className={`w-fit bg-green-600 text-sm absolute text-white  px-2 text-center rounded-full top-[-3px] ${cart.length > 0 ? 'flex' : 'hidden'} right-[-15px]`}>{cart.length}</p></NavLink>
                </> : ""}
            </div>
        </nav>
    </>)
}

export default Navbar