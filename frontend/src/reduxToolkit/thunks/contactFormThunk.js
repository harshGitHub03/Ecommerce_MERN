import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookie from "js-cookie";

export const contactFormThunk = createAsyncThunk("/contactForm",
    async (data, { rejectWithValue, dispatch }) => {
        const { formData, navigate } = data;

        // ** because of public suffix list issue , setting token on session storage "study purpose", restriction happens because you can't set cookies for a domain like .render.com. The solution is to use a custom domain (e.g., yourdomain.com) or session storage, which allows you to set cookies across subdomains without the PSL limitation.
        // const token = Cookie.get("jwt")

        const token = sessionStorage.getItem("token"); //have to use sessionstorage to store token , cookie dosen't work while deploying on sites as render.com etc "public suffix list issue"
        if (!token) { // if token not found!
            navigate("/login")
            return rejectWithValue({ message: "login to contact!" })
        }

        try {
            const serverResponse = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/contact`, {
                method: "post",
                headers: {
                    "content-type": "application/json",
                    "token": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })
            const response = await serverResponse.json();

            //if response.ok & status 200
            if (serverResponse.ok && serverResponse.status === 200) {
                navigate("/")
                return response
            } else {
                //for response status 400 || 401 || 500
                if (serverResponse.status === 400 || serverResponse.status === 401 || serverResponse.status === 500)
                    return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue({ message: "Network error!", response: null })
        }
    }
)