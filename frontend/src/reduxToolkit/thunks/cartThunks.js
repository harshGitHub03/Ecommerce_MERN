import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookie from "js-cookie";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { signOutUser } from "./authThunks";

// add to cart
export const addToCart = createAsyncThunk("cart/addItem",
    async (data, { getState, rejectWithValue, dispatch }) => {
        const { productDetails, navigate } = data
        const { product_id, quantity, price } = productDetails;

        //capture token
        const token = Cookie.get("jwt");
        if (!token) { //if token not found
            setTimeout(() => navigate("/login"), 100) //state change occurs after the action completes, and navigation needs to occur only after the async action is finished (i.e., after the state is updated).
            return rejectWithValue("Login to add!")
        }

        try {
            const { isAuthenticated, user } = getState().authData;

            //check if user is authenticated
            if (!isAuthenticated || !user)
                return rejectWithValue("login account to add items to cart!")

            //post fetch if autenticated is true
            const serverResponse = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/cart/addItem/`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "token": `Bearer ${token}`
                },
                body: JSON.stringify({
                    user_id: user._id,
                    product_id,
                    quantity,
                    price
                })
            })
            const response = await serverResponse.json();

            //on server is ok || status code 200
            if (serverResponse.ok || serverResponse.status === 200) {
                return response
            } else {
                //token validation fail 401
                if (serverResponse.status === 401) {
                    dispatch(signOutUser())
                    return rejectWithValue(response.response)
                }
                //validation 400
                if (serverResponse.status === 400)
                    return rejectWithValue(response.errors)
                //on user not found 404
                if (serverResponse.status === 404)
                    return rejectWithValue(response.message)
                //server error 500
                if (serverResponse.status === 500)
                    return rejectWithValue(response.message)
            }
        } catch (er) {
            //network error
            return rejectWithValue(er.message || "network error!")
        }
    }
)

//remove product from cart
export const removeFromCart = createAsyncThunk("cart/removeItem",
    async (product, { getState, rejectWithValue, dispatch }) => {
        const token = Cookie.get("jwt");
        if (!token) //if token not found
            return rejectWithValue("Login to remove!")

        const product_id = product;
        console.log("product", product)
        try {
            const { isAuthenticated, user } = getState().authData;

            //check if user is authenticated
            if (!isAuthenticated || !user)
                return rejectWithValue("login account to add items to cart!")

            //post fetch if autenticated is true
            const serverResponse = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/cart/removeItem/`, {
                method: "delete",
                headers: {
                    "Content-Type": "application/json",
                    "token": `Bearer ${token}`
                },
                body: JSON.stringify({
                    user_id: user._id,
                    product_id
                })
            })
            const response = await serverResponse.json();
            console.log(response)

            //on server is ok || status code 200
            if (serverResponse.ok || serverResponse.status === 200) {
                return response
            } else {
                //token validation fail 401
                if (serverResponse.status === 401) {
                    dispatch(signOutUser())
                    return rejectWithValue(response.response)
                }
                //validation 400
                if (serverResponse.status === 400)
                    return rejectWithValue(response.errors)
                //on user not found 404
                if (serverResponse.status === 404)
                    return rejectWithValue(response.message)
                //server error 500
                if (serverResponse.status === 500)
                    return rejectWithValue(response.message)
            }
        } catch (er) {
            //network error
            return rejectWithValue(er.message || "network error!")
        }
    }
)

// increment quantity
export const incrementQuantity = createAsyncThunk(
    "cart/incrementQuantity",
    async (product, { getState, rejectWithValue, dispatch }) => {
        const token = Cookie.get("jwt");
        if (!token) //if token not found
            return rejectWithValue("Login to increment!")

        const { product_id, quantity } = product
        console.log(product)
        try {
            const { isAuthenticated, user } = getState().authData;

            //check if user is authenticated {false}
            if (!isAuthenticated)
                return rejectWithValue("login to increment quantity in cart!")

            const serverResponse = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/cart/incrementItem/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "token": `Bearer ${token}`
                },
                body: JSON.stringify({
                    user_id: user._id,
                    product_id: product_id,
                    quantity: quantity
                })
            });

            const response = await serverResponse.json();

            //on server is ok || status code 200
            if (serverResponse.ok || serverResponse.status == 200) {
                return response
            } else {
                //token validation fail 401
                if (serverResponse.status === 401) {
                    dispatch(signOutUser())
                    return rejectWithValue(response.response)
                }
                //validation 400
                if (serverResponse.status === 400)
                    return rejectWithValue(response.errors)
                //on user not found 404 
                if (serverResponse.status === 404)
                    return rejectWithValue(response.message)
                //server error 500
                if (serverResponse.status === 500)
                    return rejectWithValue(response.message)
            }
        } catch (er) {
            return rejectWithValue(er.message)
        }
    }
)

// decrement quantity
export const decrementQuantity = createAsyncThunk(
    "cart/decrementQuantity",
    async (product, { getState, rejectWithValue, dispatch }) => {

        //check for jwt  token
        const token = Cookie.get("jwt");
        if (!token) {//if token not found
            return rejectWithValue("Login to decrement!")
        }
        const { product_id, quantity } = product

        try {
            const { isAuthenticated, user } = getState().authData;

            if (!isAuthenticated)//check if user is authenticated {false}
                return rejectWithValue("login to decrement quantity in cart!")
            console.log("reached")
            const serverResponse = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/cart/decrementItem/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "token": `Bearer ${token}`
                },
                body: JSON.stringify({
                    user_id: user._id,
                    product_id: product_id,
                    quantity: quantity
                })
            });
            const response = await serverResponse.json();
            console.log(response)
            //on server is ok || status code 200
            if (serverResponse.ok || serverResponse.status == 200) {
                return response
            } else {
                //token validation fail 401
                if (serverResponse.status === 401) {
                    dispatch(signOutUser())
                    return rejectWithValue(response.response)
                }
                //validation 400
                if (serverResponse.status === 400)
                    return rejectWithValue(response.errors)
                //on user not found 404 ||
                if (serverResponse.status === 404)
                    return rejectWithValue(response.message)
                //server error 500
                if (serverResponse.status === 500)
                    return rejectWithValue(response.message)
            }
        } catch (er) {
            return rejectWithValue(er.message)
        }
    }
)