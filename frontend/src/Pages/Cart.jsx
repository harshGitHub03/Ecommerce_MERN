import React, { useDebugValue, useEffect, useState } from 'react'
import CartComponent from '../Components/CartComponents/CartComponent'
import { useDispatch, useSelector } from 'react-redux'
import CartEmpty from '../Components/CartComponents/CartEmpty'
import Payment from '../Components/CartComponents/PaymentComp/Payment'
import { verifyAuthToken } from '../reduxToolkit/thunks/authThunks'
import { useNavigate } from 'react-router-dom'

function Cart() {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { loading, isAuthenticated } = useSelector((state) => state.authData);
    const { cart } = useSelector(state => state.cartData)

    // show/hide payment module
    const [paymentDisplay, setPaymentDisplay] = useState(false)

    useState(() => {
        // check for auth before access cart
        dispatch(verifyAuthToken())
    }, [])

    //verify token & isAuthenticated on rendering CART page
    useEffect(() => {
        //if loading & isAuthenticated both is false
        if (!loading && !isAuthenticated)
            navigate("/login")
    }, [isAuthenticated, loading])


    return (<>
        {
            // cart component || cart empty component
            cart.length > 0 ? <CartComponent setPaymentDisplay={setPaymentDisplay} /> : <CartEmpty />
        }

        {/* payment component Show || hide */}
        {paymentDisplay ? < Payment setPaymentDisplay={setPaymentDisplay} /> : ""}
    </>)
}

export default Cart