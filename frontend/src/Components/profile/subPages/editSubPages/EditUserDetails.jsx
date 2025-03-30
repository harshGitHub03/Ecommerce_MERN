import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form"
import { updateUserDetails } from '../../../../reduxToolkit/thunks/authThunks';
import { useNavigate } from 'react-router-dom';

function EditUserDetails({ editButton, setEditButton }) {
    const { user, error, errorCode } = useSelector((state) => state.authData)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    console.log(error)
    console.log(errorCode)
    //only find and assin error when error code is 400 // validation error
    const nameError = errorCode === 400 && error.find((current) => current.path === "name")
    const emailError = errorCode === 400 && error.find((current) => current.path === "email")
    const cityError = errorCode === 400 && error.find((current) => current.path === "city")
    const contactError = errorCode === 400 && error.find((current) => current.path === "contact")
    const genderError = errorCode === 400 && error.find((current) => current.path === "gender")
    const ageError = errorCode === 400 && error.find((current) => current.path === "age")

    //form handler hook
    const { register, handleSubmit } = useForm();

    //user details
    const name = user?.name || "Enter Name";
    const email = user?.email || "Enter Email"
    const city = user?.city || "Enter City"
    const contact = user?.contact || "Enter Contact";
    const gender = user?.gender || "";
    const age = user?.age || "Enter Age"

    //edit details handler
    const formHandler = (data) => {
        // parse age, contact to number from string data
        const processedData = {
            ...data,
            contact: data.contact ? parseInt(data.contact) : null,
            age: data.age ? parseInt(data.age) : null
        }
        console.log("proccessed", processedData)

        dispatch(updateUserDetails({ processedData, navigate, toggleEditProfile: { setEditButton, editButton } }));
    }

    return (
        <form onSubmit={handleSubmit(formHandler)} className='shadow-md my-6 px-7 flex flex-col border-[1.5px]'>
            <main className='flex'>
                <div className='w-1/2 mr-5'>
                    <div className='mt-6 flex flex-col'>
                        <label htmlFor='name' className='text-sm text-gray-600'>Name<sup>*</sup></label>
                        <input type="text" {...register("name")} className={nameError ? "border-b-[1.5px] border-red-500" : ""} defaultValue={name} placeholder={name} />
                        <p className='text-red-500 text-[0.75rem]'>{nameError && nameError.msg}</p>
                    </div>
                    <div className='mt-5 flex flex-col'>
                        <label htmlFor='email' className='text-sm text-gray-600'>E-mail<sup>*</sup></label>
                        <input type="text" {...register("email")} className={emailError ? "border-b-[1.5px] border-red-500" : ""} defaultValue={email} placeholder={email} />
                        <p className='text-red-500 text-[0.75rem]'>{emailError && emailError.msg}</p>
                    </div>
                    <div className='my-5 flex flex-col'>
                        <label htmlFor='city' className='text-sm text-gray-600'>City</label>
                        <input type="text" {...register("city")} className={cityError ? "border-b-[1.5px] border-red-500" : ""} placeholder={city} />
                        <p className='text-red-500 text-[0.75rem]'>{cityError && cityError.msg}</p>
                    </div>
                </div>

                <div className='w-1/2 mr-5'>
                    <div className='mt-6 flex flex-col'>
                        <label htmlFor='phone' className='text-sm text-gray-600'>Contact</label>
                        <input type="tel" {...register("contact")} className={contactError ? "border-b-[1.5px] border-red-500" : ""} placeholder={contact} />
                        <p className='text-red-500 text-[0.75rem]'>{contactError && contactError.msg}</p>
                    </div>
                    <div className='mt-5 flex flex-col'>
                        <label htmlFor='age' className='text-sm text-gray-600'>Gender</label>
                        <select {...register("gender")} defaultValue={gender}>
                            <option value="" selected disabled>None</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        <p className='text-red-500 text-[0.75rem]'>{genderError && genderError.msg}</p>
                    </div>
                    <div className='my-5 flex flex-col'>
                        <label htmlFor='age' className='text-sm text-gray-600'>Age</label>
                        <input type="number" className={ageError ? "border-b-[1.5px] border-red-500" : ""} {...register("age")} placeholder={age} />
                        <p className='text-red-500 text-[0.75rem]'>{ageError && ageError.msg}</p>
                    </div>
                </div>

            </main>
            <div className='flex self-end pb-2'>
                <button onClick={() => setEditButton(!editButton)} type='button' class="h-fit mr-4 px-6 mb-[3%] w-fit font-semibold hover:bg-gray-400 hover:text-white text-white active:bg-[#0c544f] active:text-white py-2 bg-red-600">Cancel</button>
                <button type='submit' class="h-fit  px-6  w-fit font-semibold hover:bg-gray-400 hover:text-white text-gray-700 active:bg-[#0c544f] active:text-white py-2 bg-green-600 text-white">Save</button>
            </div>
        </form>
    )
}

export default EditUserDetails