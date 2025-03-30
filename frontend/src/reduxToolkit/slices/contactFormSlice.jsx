import { createSlice } from "@reduxjs/toolkit"
import { contactFormThunk } from "../thunks/contactFormThunk"

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const contactFormSlice = createSlice({
    name: "contactSlice",
    initialState: {
        errors: null,
        loading: true
    },
    extraReducers: (builder) => {
        builder.addCase(contactFormThunk.fulfilled, (state, action) => {
            const { message, response } = action.payload;
            toast(message);

            state.errors=null;
            state.loading=false;
        })

        builder.addCase(contactFormThunk.pending, (state, action) => {
            state.errors = null;
            state.loading = true;
        })

        builder.addCase(contactFormThunk.rejected, (state, action) => {
            const { message, errors } = action.payload;
            state.errors = errors?.errors||null;
            toast(message)
            state.loading = false
        })
    }
})

export default contactFormSlice.reducer;