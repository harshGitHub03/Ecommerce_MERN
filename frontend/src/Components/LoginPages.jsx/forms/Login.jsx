import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../../reduxToolkit/thunks/authThunks';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.authData)

    //login errors
    //check error is an array before find()
    const usernameError = Array.isArray(error) ? error.find((ele) => ele.path === "email") : null;
    const passwordError = Array.isArray(error) ? error?.find((ele) => ele.path === "password") : null;

    //form Handling hook
    const { register, handleSubmit } = useForm();

    //password hide show
    const [passwordEye, setPasswordEye] = useState(false)

    //form handling function and Dispatch login thunk
    const formHandling = async (userInput) => {
        dispatch(login({ userInput, navigate }))//passed userFormInput & navigate()
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
                navigate("/") //redirect home
            }
        };
        document.body.addEventListener('click', handler);
        return () => document.body.removeEventListener('click', handler);
    }, [])

    return (
        <div className='h-screen w-screen fixed top-0 z-10 flex justify-center items-center bg-[#000000a1] '>
            <div ref={ref} className='bg-black flex flex-col h-fit items-center gap-6 max-md:py-[3rem] py-[3rem] text-white max-sm:px-[2.5rem] max-md:px-[3.5rem] px-[3.6vw]'>
                <form onSubmit={handleSubmit(formHandling)} className='flex flex-col gap-4 max-sm:w-[60vw] max-md:w-[45vw] max-lg:w-[36vw] w-[20rem]'>
                    <h4 className='text-4xl self-start font-medium'>Welcome <br />Back!</h4>
                    <div>

                        <label className={`${usernameError ? "border-b-2 border-b-red-600" : ""} bg-[#333333] inline flex items-center w-full p-2 `}>

                            <i class="fa-solid fa-user h-4"></i>
                            <input type="text" {...register("email")} className='bg-[#333333] w-full outline-none px-2' placeholder='Email' />
                        </label>
                        <span className='text-sm text-red-600'>{usernameError?.msg || null}</span>
                    </div>

                    <div>
                        <label className={`${passwordError ? "border-b-2 border-b-red-600" : ""} bg-[#333333] inline-block w-full p-2 select-none flex items-center`}>
                            <i class="fa-solid fa-user h-4"></i>
                            <input type={`${passwordEye ? 'text' : 'password'}`} {...register("password")} className={`bg-[#333333] w-full outline-none px-2 `} placeholder='Password' />
                            <i onClick={() => setPasswordEye(passwordEye ? false : true)} class={`${passwordEye ? "fa-regular fa-eye-slash" : "fa-regular fa-eye mx-[1px]"} p-1`}></i>
                        </label>
                        <span className='text-sm text-red-600'>{passwordError?.msg || null}</span>
                    </div>
                    <button className='bg-gray-400 text-lg font-medium text-black py-1 mt-2'>{loading ? "loading..." : 'sign In'}</button>
                </form>
                <div className='text-sm flex w-full justify-between'>
                    <span className='text-gray-400'>dosen't have an account?</span>
                    <Link to="/register" onClick={(e) => e.stopPropagation()} className='text-red-700  hover:text-red-600 underline'>Register</Link>
                </div>
            </div>
        </div>
    )
}

export default Login;