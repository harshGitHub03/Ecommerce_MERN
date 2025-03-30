import { createAsyncThunk } from "@reduxjs/toolkit"

export const fetchTotalProducts = createAsyncThunk("fetchApi", async () => {
    const json = await fetch(`${import.meta.env.VITE_FETCH_TOTAL_PRODUCTS}/products`, {
        method: "get",
        headers:{
            "content-type":"application/json"
        }
    })
    return await json.json()
})
