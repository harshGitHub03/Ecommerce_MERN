import { createSlice } from "@reduxjs/toolkit";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//thunks
import { addToCart, removeFromCart, decrementQuantity, incrementQuantity } from "../thunks/cartThunks";

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: [],
        loading: false,
        error: "",
        totalAmount: 0
    },
    reducers: {
        //insert cart data 
        insertCartData(state, action) {
            if (action.payload)
                state.cart = action.payload
        },
        clearCartData(state) {
            state.cart = []
        },
        addCart(state, action) {
            //find index returns index if found / else -1 if not found
            const find = state.cart.findIndex(item => item.id == action.payload.id)
            if (find >= 0) {
                state.cart[find].quantity += 1
                toast('Item Quantity + 1')
            }
            else {
                const tempvar = { ...action.payload, quantity: 1 }
                state.cart.push(tempvar)

                toast("Added to cart!")
            }
        },
        // removeFromCart(state, action) {
        //     state.cart = state.cart.filter((item) => item.id !== action.payload.id);
        //     toast('Removed from cart!')
        // },
        // decrementItem(state, action) {
        //     const index = state.cart.findIndex((item) => item.id === action.payload.id)
        //     state.cart[index].quantity -= 1
        //     toast('Quantity decreased -1')
        // },
        // incrementItem(state, action) {
        //     const index = state.cart.findIndex((item) => item.id === action.payload.id)
        //     state.cart[index].quantity += 1
        //     toast('Quantity Increased +1')
        // },

        getTotal(state, action) {
            const totalAmount = state.cart.reduce((total, item) => {
                return total += item.quantity * item.price
            }, 0)

            state.totalAmount = totalAmount
        }
    },
    extraReducers: (builder) => {
        //add to cart
        builder.addCase(addToCart.fulfilled, (state, action) => {
            //destructure action.payload
            const { message, response } = action.payload;

            //check if product already exist on cart
            const isExist = state.cart.find(element => element.product_id === response.product_id);

            if (isExist)//if product already in cart
                //find() returned reference of product / can change directly
                isExist.quantity = response.quantity
            else//if product is new to cart
                state.cart.push(response)

            toast.success(message)
        });

        //remove from cart
        builder.addCase(removeFromCart.fulfilled, (state, action) => {
            const { message, response } = action.payload;

            state.cart = state.cart?.filter((element) => element.product_id != response.product_id)
            toast(message)
        })

        //increment quanity of product
        builder.addCase(incrementQuantity.fulfilled, (state, action) => {
            const { message, response } = action.payload;
            const isExist = state.cart.find(item => item.product_id === response.product_id)
            //got the reference of product
            if (isExist)
                isExist.quantity = response.quantity;
            toast(message)
        })

        //decrement quantity of product
        builder.addCase(decrementQuantity.fulfilled, (state, action) => {
            const { message, response } = action.payload
            console.log(action.payload)
            const isExist = state.cart.find(item => item.product_id === response.product_id)
            //get the reference of product
            if (isExist)
                isExist.quantity = response.quantity;
            if (response.quantity === 0)
                state.cart = state.cart.filter(item => item.product_id !== response.product_id)
            toast(message)
        })

        builder.addCase(addToCart.pending, (state, action) => { state.loading = true });
        builder.addCase(addToCart.rejected, (state, action) => { state.loading = false; state.error = action.payload; toast(action.payload) });
        builder.addCase(removeFromCart.pending, (state, action) => { state.loading = true });
        builder.addCase(removeFromCart.rejected, (state, action) => { state.loading = false; state.error = action.payload; toast(action.payload) });
        builder.addCase(incrementQuantity.pending, (state, action) => { state.loading = true });
        builder.addCase(incrementQuantity.rejected, (state, action) => { state.loading = false; state.error = action.payload ;toast(action.payload)});
        builder.addCase(decrementQuantity.pending, (state, action) => { state.loading = true });
        builder.addCase(decrementQuantity.rejected, (state, action) => { state.loading = false; state.error = action.payload; toast(action.payload) });
    }
})

export const { insertCartData, clearCartData, addCart, decrementItem, incrementItem, getTotal } = cartSlice.actions
export default cartSlice.reducer