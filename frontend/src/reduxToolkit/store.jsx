import { configureStore } from "@reduxjs/toolkit";

// slice reducers & state
import productsSlice from "./slices/productsSlice";
import cartSlice from "./slices/cartSlice";
import authSlice from "./slices/authSlice"
import contactFormSlice from "./slices/contactFormSlice"

const store=configureStore({
    reducer:{
        productsData:productsSlice,
        cartData:cartSlice,
        authData:authSlice,
        contactForm:contactFormSlice
    }
})

export default store