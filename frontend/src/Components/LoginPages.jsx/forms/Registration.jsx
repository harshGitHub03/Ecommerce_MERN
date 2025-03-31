import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from "react-redux"
import { registration } from '../../../reduxToolkit/thunks/authThunks';
import { Link, NavLink, useNavigate } from 'react-router-dom';
// import { login } from '../../../reduxToolkit/slices/authSlice';

function Registration() {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.authData)

    //registration error
    const nameError = Array.isArray(error) ? error.find((ele) => ele.path === "name") : null;
    const emailError = Array.isArray(error) ? error.find((ele) => ele.path === "email") : null;
    const passwordError = Array.isArray(error) ? error.find((ele) => ele.path === "password") : null;
    const confirmPasswordError = Array.isArray(error) ? error.find((ele) => ele.path === "confirmPassword") : null;

    //form Handling hook
    const { register, handleSubmit } = useForm();

    //password hide show
    const [passwordEye, setPasswordEye] = useState(false)
    const [cPasswordEye, setCPasswordEye] = useState(false)

    //form handling function
    const formHandling = async (userInput) => {
        dispatch(registration({ userInput, navigate }))
    }

    // hide scrollbar while sign up diplay
    useEffect(() => {
        document.body.style.overflowY = "hidden";
        return () => document.body.style.overflowY = "auto";
    })

    //to close signUp form on click outside area
    const ref = useRef()
    useEffect(() => {
        console.log("hi")
        const handler = (e) => {
            // Check if click is outside the popup (ref element)
            if (!ref.current.contains(e.target)) {
                // console.log("Clicked outside the popup");
                navigate("/") //back route page
            }
        };
        document.body.addEventListener('click', handler);
        return () => document.body.removeEventListener('click', handler);
    }, [])

    return (
        <div className='h-screen w-screen fixed top-0 z-10 flex justify-center items-center bg-[#000000a1] '>
            <div ref={ref} className='bg-black flex flex-col h-fit items-center gap-6 max-md:py-[3rem] py-[3rem] text-white max-sm:px-[2.5rem] max-md:px-[3.5rem] px-[3.6vw]'>
                <form onSubmit={handleSubmit(formHandling)} className='flex flex-col gap-4 max-sm:w-[60vw] max-md:w-[45vw] max-lg:w-[36vw] w-[20rem]'>
                    <h4 className='text-4xl mb-2 self-start font-medium'>Create <br />Account!</h4>

                    <div>
                        <label className={`${nameError ? "border-b-2 border-b-red-600" : ""} bg-[#333333] flex items-center inline p-2 `}>
                            <i class="fa-solid fa-user h-4"></i>
                            <input type="text" {...register("name")} className='bg-[#333333] w-full  outline-none px-2' placeholder='Name' />
                        </label>
                        <span className='text-sm text-red-600'>{nameError?.msg || null}</span>
                    </div>

                    <div>
                        <label className={`${emailError ? "border-b-2 border-b-red-600" : ""} bg-[#333333] flex items-center inline p-2 `}>
                            <i class="fa-solid fa-user h-4"></i>
                            <input type="text" {...register("email")} className='bg-[#333333] w-full outline-none px-2' placeholder='Email' />
                        </label>
                        <span className='text-sm text-red-600'>{emailError?.msg || null}</span>
                    </div>

                    <div>
                        <label className={`${passwordError ? "border-b-2 border-b-red-600" : ""} bg-[#333333] flex items-center inline p-2 `}>
                            <i class="fa-solid fa-user h-4"></i>
                            <input type={`${passwordEye ? 'text' : 'password'}`} {...register("password")} className='bg-[#333333] w-full outline-none px-2 ' placeholder='Password' />
                            <i onClick={() => setPasswordEye(passwordEye ? false : true)} class={`${passwordEye ? "fa-regular fa-eye-slash" : "fa-regular fa-eye mx-[1px]"} p-1`}></i>
                        </label>
                        <span className='text-sm text-red-600'>{passwordError?.msg || null}</span>
                    </div>

                    <div>
                    <label className={`${nameError ? "border-b-2 border-b-red-600" : ""} bg-[#333333] flex items-center inline p-2 `}>
                            <i class="fa-solid fa-user h-4"></i>
                            <input type={`${cPasswordEye ? 'text' : 'password'}`} {...register("confirmPassword")} className='bg-[#333333] w-full outline-none px-2 ' placeholder='Confirm password' />
                            <i onClick={() => setCPasswordEye(cPasswordEye ? false : true)} class={`${cPasswordEye ? "fa-regular fa-eye-slash" : "fa-regular fa-eye mx-[1px]"} p-1`}></i>
                        </label>
                        <span className='text-sm text-red-600'>{confirmPasswordError?.msg || null}</span>
                    </div>

                    <button type='submit' className='bg-gray-400 text-lg font-medium text-black py-1 mt-2'>{loading ? "loading..." : "sign up"}</button>
                </form>
                <div className='text-sm flex w-full justify-between'>
                    <span className='text-gray-400'>dosen't have an account?</span>
                    <Link to="/login" onClick={(e) => e.stopPropagation()} className='text-red-700  hover:text-red-600 underline'>Login</Link>
                </div>
            </div>
        </div>
    )
}

export default Registration;