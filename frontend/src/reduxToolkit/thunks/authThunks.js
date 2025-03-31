import { createAsyncThunk } from "@reduxjs/toolkit";
import { clearCartData, insertCartData } from "../slices/cartSlice";
import Cookie from "js-cookie"
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

//update User data
export const updateUserDetails = createAsyncThunk("/user/updateDetails",
    async (data, { getState, rejectWithValue, dispatch }) => {
        const { processedData, toggleEditProfile, navigate } = data;
        const { setEditButton, editButton } = toggleEditProfile; //to toggle profile edit(open/close)

        // ** because of public suffix list issue , setting token on session storage "study purpose", restriction happens because you can't set cookies for a domain like .render.com. The solution is to use a custom domain (e.g., yourdomain.com) or session storage, which allows you to set cookies across subdomains without the PSL limitation.
        // const token = Cookie.get("jwt")

        const token = sessionStorage.getItem("token"); //have to use sessionstorage to store token , cookie dosen't work while deploying on sites as render.com etc "public suffix list issue"
        if (!token) { // if jwt token not found "expired or deleted"
            dispatch(signOutUser(navigate))
            return rejectWithValue({ message: "token not found!", response: null })
        }
        try {
            const { user } = getState().authData;

            if (!user) //if user not logged in
                return rejectWithValue({ message: "user not logged in", response: null })

            // Including userId (_id) in user input to send to server
            const updatedProcessedData = { _id: user?._id, ...processedData }
            const serverResponse = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/auth/updateDetails`, {
                method: "Put",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedProcessedData)
            })
            const response = await serverResponse.json()

            //if response.ok
            if (serverResponse.ok || serverResponse.status === 200) {
                setEditButton(!editButton); //to toggle profile edit(open/close)
                return response
            } else {
                //on status code 404||401 error
                if (serverResponse.status === 400 || serverResponse.status === 401 || serverResponse.status === 404)
                    return rejectWithValue({ code: serverResponse.status, ...response })

                //on status code 500 / server error
                if (serverResponse.status === 500)
                    return rejectWithValue(response)
            }
        } catch (er) {
            return rejectWithValue({ message: "network error", response: er })
        }
    }
)

//insert User Addresses
export const insertUserAddress = createAsyncThunk("/user/updateAddresses",
    async (data, { getState, rejectWithValue, dispatch }) => {
        const { addresses, setEditAddressesToggle } = data;

        // ** because of public suffix list issue , setting token on session storage "study purpose", restriction happens because you can't set cookies for a domain like .render.com. The solution is to use a custom domain (e.g., yourdomain.com) or session storage, which allows you to set cookies across subdomains without the PSL limitation.
        // const token = Cookie.get("jwt")

        const token = sessionStorage.getItem("token"); //have to use sessionstorage to store token , cookie dosen't work while deploying on sites as render.com etc "public suffix list issue"
        if (!token) //if token not found / might get expired or deleted!
            return rejectWithValue({ message: "token not found!", response: null })

        try {
            const { user } = getState().authData; //retrieve user_id

            if (!user) //if user not logged in
                return rejectWithValue({ message: "user not logged in", response: null })

            const serverResponse = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/auth/insertUserAddress`, {
                method: "Post",
                headers: {
                    "Content-Type": "Application/json"
                },
                body: JSON.stringify({
                    user_id: user._id,
                    addresses: addresses
                })
            })
            const response = await serverResponse.json();

            //if response.ok
            if (serverResponse.ok || serverResponse.status === 200) {
                setEditAddressesToggle((prev) => !prev) //close editAddress component on success
                return response
            } else {
                //on status code 404||401 error
                if (serverResponse.status === 400 || serverResponse.status === 404)
                    return rejectWithValue({ code: serverResponse.status, ...response })

                //on status code 500 / server error
                if (serverResponse.status === 500)
                    return rejectWithValue(response)
            }
        } catch (error) {
            return rejectWithValue({ message: "Network Error", response: error })
        }
    }
)


//SIGN OUT user Thunk
export const signOutUser = createAsyncThunk("/auth/signOut",
    (navigate, { rejectWithValue, dispatch }) => {

        // const isToken = Cookie.get("jwt")
        
        // ** because of public suffix list issue , setting token on session storage "study purpose", restriction happens because you can't set cookies for a domain like .render.com. The solution is to use a custom domain (e.g., yourdomain.com) or session storage, which allows you to set cookies across subdomains without the PSL limitation.
        const isToken = sessionStorage.getItem("token");//have to use sessionstorage to store token , cookie dosen't work while deploying on sites as render.com etc "public suffix list issue"

        if (isToken) {
            // Cookie.remove("jwt") //remove token 

            // ** because of public suffix list issue , setting token on session storage "study purpose", restriction happens because you can't set cookies for a domain like .render.com. The solution is to use a custom domain (e.g., yourdomain.com) or session storage, which allows you to set cookies across subdomains without the PSL limitation.
            sessionStorage.removeItem("token"); //have to use sessionstorage to store token , cookie dosen't work while deploying on sites as render.com etc "public suffix list issue"

            dispatch(clearCartData()) //clear cart
            navigate("/")
            return { message: "User Signed Out successfully!" }
        } else {
            navigate("/login")
            return rejectWithValue({ message: "Already signed out!" })
        }
    }
)

//token authentication on reload
export const verifyAuthToken = createAsyncThunk("auth/verifyToken",
    async (_, { rejectWithValue, dispatch }) => {//important to get "data"(_) in argument to get {rejectWithValue, dispatch }

        // ** because of public suffix list issue , setting token on session storage "study purpose", restriction happens because you can't set cookies for a domain like .render.com. The solution is to use a custom domain (e.g., yourdomain.com) or session storage, which allows you to set cookies across subdomains without the PSL limitation.
        // const token = Cookie.get("jwt")

        const token = sessionStorage.getItem("token"); //have to use sessionstorage to store token , cookie dosen't work while deploying on sites as render.com etc "public suffix list issue"
        if (!token)
            return rejectWithValue("Token not found in the cookie.")

        try {
            const serverResponse = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/auth/verifyToken`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "token": `Bearer ${token}`
                }
            })
            const response = await serverResponse.json()

            //on jsonRes is "ok" and status 200
            if (serverResponse.ok || serverResponse.status === 200) {

                //insert data of cart and user
                dispatch(insertCartData(response.response?.cart))
                return response
            } else {
                //clear Cart if verification fails
                dispatch(clearCartData())

                //on status code 404||401||400 error
                if (serverResponse.status === 400 || serverResponse.status === 401 || serverResponse.status === 404)
                    return rejectWithValue(response?.message)

                //on status code 500 / server error
                if (serverResponse.status === 500)
                    return rejectWithValue(response.message)
            }
        } catch (error) {
            //on netork errors
            return rejectWithValue(error.message || "Network error! please check your network connection.")
        }
    }
)

//login thunk
export const login = createAsyncThunk(
    "auth/login",
    async (data, { rejectWithValue, dispatch }) => {
        const { userInput, navigate } = data;//got userLoginInput & navigate()

        try {
            const serverResponse = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/auth/login`, {
                method: "post",
                credentials: "include",// allows cookies to be sent and received in requests and responses
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userInput)
            })
            const response = await serverResponse.json();

            //on jsonRes is "ok" and status 200
            if (serverResponse.ok || serverResponse.status === 200) {
                navigate("/");//navigate to home if user login success
                //sent data of cart to cartSlice && user data to userSlice
                dispatch(insertCartData(response.response.cart))
                return response
            } else {
                //on status code 404||401||400 error
                if (serverResponse.status === 400 || serverResponse.status === 401 || serverResponse.status === 404)
                    return rejectWithValue(response)

                //on status code 500 / server error
                if (serverResponse.status === 500)
                    return rejectWithValue(response.message)
            }
        } catch (error) {
            //on network or server error
            return rejectWithValue(error.message || "Network error! please check your network connection.")
        }
    }
)

//registration thunk
export const registration = createAsyncThunk("auth/register",
    async (data, { rejectWithValue, dispatch }) => {
        const { userInput, navigate } = data;

        try {
            const serverResponse = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/auth/registration`, {
                method: "post",
                credentials: "include",// allows cookies to be sent and received in requests and responses
                headers: {
                    "content-type": 'application/json'
                },
                body: JSON.stringify(userInput)
            })
            const response = await serverResponse.json()

            //on jsonRes is "ok" and status 200
            if (serverResponse.ok || serverResponse.status === 200) {
                navigate("/"); //navigate to home if user registration success
                //sent data of cart to cartSlice && user data to userSlice
                dispatch(insertCartData(response.response.cart))
                return response
            } else {

                //on status code 404||409 error
                if (serverResponse.status === 400 || serverResponse.status === 409)
                    return rejectWithValue(response)

                //on status code 500 / server error
                if (serverResponse.status === 500)
                    return rejectWithValue(response.message)
            }
        } catch (error) {
            return rejectWithValue(error.message || "Network error! please check your network connection.")
        }
    }
)