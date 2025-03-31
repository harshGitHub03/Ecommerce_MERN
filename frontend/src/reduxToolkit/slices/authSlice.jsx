import { createSlice } from "@reduxjs/toolkit";
import { insertUserAddress, login, registration, signOutUser, updateUserDetails, verifyAuthToken } from "../thunks/authThunks";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: false,
        user: null,
        loading: true,
        error: false,
        errorCode: null,
        token: null
    },
    reducers: {
        // login:(state,action)=>{
        //     state.isAuthenticated=true;
        //     state.user=action.payload;
        // },
        // logout:(state)=>{
        //     state.isAuthenticated=false;
        //     state.user=null;
        // }
    },
    extraReducers: (builder) => {
        //updateUserDetails FULLFILLED
        builder.addCase(updateUserDetails.fulfilled, (state, action) => {
            state.user = action.payload.response
            toast(action.payload.message)
            state.error = false
            state.errorCode = null
            state.loading = false
        })

        //inser User Addresses
        builder.addCase(insertUserAddress.fulfilled, (state, action) => {
            state.user.addresses = action.payload.response.updatedAddresses || []; // incase updated address not present, it'll assign empty array
            toast(action.payload.message)
            state.error = false
            state.errorCode = null
            state.loading = false
        })

        //on signOut fullfilled
        builder.addCase(signOutUser.fulfilled, (state, action) => {
            state.isAuthenticated = false,
                state.user = null,
                state.loading = false,
                state.error = false
            toast(action.payload.message)
        })

        //on tokenVerify fullfilled
        builder.addCase(verifyAuthToken.fulfilled, (state, action) => {
            const { isAuthorized, message, response } = action?.payload;
            const { cart, ...userData } = response // exclude cart data

            state.isAuthenticated = isAuthorized || false;
            state.user = userData // exclude cart data
            state.error = false
            state.loading = false
            toast.success(message)
        })

        //on login fullfilled
        builder.addCase(login.fulfilled, (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.response
            state.error = false
            state.loading = false
            toast.success(action.payload.message)

        // ** because of public suffix list issue , setting token on session storage "study purpose", restriction happens because you can't set cookies for a domain like .render.com. The solution is to use a custom domain (e.g., yourdomain.com) or session storage, which allows you to set cookies across subdomains without the PSL limitation.
            sessionStorage.setItem("token", action.payload.token)
        });

        //on registration fullfilled
        builder.addCase(registration.fulfilled, (state, action) => {

            state.isAuthenticated = true;
            state.user = action.payload.response
            state.error = false
            state.loading = false
            toast.success(action.payload.message)

            // ** because of public suffix list issue , setting token on session storage "study purpose", restriction happens because you can't set cookies for a domain like .render.com. The solution is to use a custom domain (e.g., yourdomain.com) or session storage, which allows you to set cookies across subdomains without the PSL limitation.
            sessionStorage.setItem("token", action.payload.token)
        });

        //updateUserDetails, verifyToken, login and registration PENDING 
        builder.addCase(updateUserDetails.pending, (state) => { state.loading = true; state.error = false; state.errorCode = null });
        builder.addCase(insertUserAddress.pending, (state) => { state.loading = true; state.error = false; state.errorCode = null });
        builder.addCase(verifyAuthToken.pending, (state) => { state.loading = true; state.error = false });
        builder.addCase(login.pending, (state) => { state.loading = true; state.error = false });
        builder.addCase(registration.pending, (state) => { state.loading = true; state.error = false });


        //updateUserDetails,verifyToken, login and registration REJECTED
        builder.addCase(updateUserDetails.rejected, (state, action) => {
            const { code, message, response } = action?.payload
            state.error = response?.errors || null
            state.errorCode = code || null
            state.loading = false;
            toast(message)
        })

        builder.addCase(insertUserAddress.rejected, (state, action) => {
            const { code, message, response } = action?.payload
            state.error = response?.errors || null
            state.errorCode = code || null
            state.loading = false
            toast(message)
        })

        builder.addCase(signOutUser.rejected, (state, action) => {
            toast(action.payload.message)
        })

        builder.addCase(verifyAuthToken.rejected, (state, action) => {
            state.error = action.payload || "Auth Error!"
            state.loading = false
            state.isAuthenticated = false;
            state.user = null

            toast(action.payload)
        })

        builder.addCase(login.rejected, (state, action) => {
            state.isAuthenticated = false;
            state.loading = false;
            state.error = action.payload.response?.errors || action.payload.message;
            toast.error(action.payload.message)
        })
        builder.addCase(registration.rejected, (state, action) => {
            state.isAuthenticated = false;
            state.loading = false;
            state.error = action.payload.response?.errors || action.payload.message;
            toast.error(action.payload.message)
        })
    }
});

export default authSlice.reducer