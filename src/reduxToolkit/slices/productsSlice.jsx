import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchTotalProducts } from "../thunks/productsThunk";


const productsData = createSlice({
    name: 'productData',
    initialState: {
        data: [],
        loading: true,
        error: false
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTotalProducts.fulfilled, (state, action) => {
            state.loading = false
            state.data = action.payload
        });
        builder.addCase(fetchTotalProducts.rejected, (state, action) => {
            state.loading = false
            state.error = true
        });
        builder.addCase(fetchTotalProducts.pending, (state, action) => {
            state.loading = true
        })
    }
})

export default productsData.reducer