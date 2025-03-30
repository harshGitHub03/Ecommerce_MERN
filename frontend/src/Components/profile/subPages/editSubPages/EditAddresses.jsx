import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { insertUserAddress } from '../../../../reduxToolkit/thunks/authThunks';

function EditAddresses({ setEditAddressesToggle }) {
    const dispatch = useDispatch();
    const { user, error } = useSelector((state) => state.authData)
    const userAddresses = user?.addresses; //user address

    useEffect(() => {
        if (userAddresses)
            setAddress(userAddresses);
    }, [user])

    //address msg
    const addressValidationError = error && error[0]?.msg;

    //form handling hook
    const { register, handleSubmit } = useForm();

    //to add address
    const [address, setAddress] = useState([])
    const [inputValue, setInputValue] = useState("")

    // for edit address
    const [editIndex, setEditIndex] = useState(null)
    const [editInputField, setEditInputField] = useState("")

    //Input field handler
    const inputValueHandler = (e) => {
        setInputValue(e.target.value)
    }

    //Add address handler
    const addAddressHandler = () => {
        setAddress((previous) => [...previous, inputValue]);
        setInputValue("")
    }

    //save edit address
    const editIndexHandler = (i) => setEditIndex(i); //set edit index being edit
    const editInputFieldHandler = (e) => setEditInputField(e.target.value); //set edit input field value
    const saveEditAddressHandler = (index) => { //update edited address
        console.log("editInputField", editInputField)
        if (editInputField) {  //only save when editField is not falsy, to prevent empty field save
            setAddress((prev) => {
                const updatedAddresses = prev.map((ele, i) => {
                    if (i === index)
                        return editInputField; //only change the updated element on address array
                    return ele;
                })
                return updatedAddresses;// return updated address
            })
            console.log("add after set", address)
        }
        setEditIndex(null);//set index null after edit
        setEditInputField("")
    }


    //Delete address handler
    const deleteAdressHandler = (i) => {
        const filteredAdress = address.filter((element, index) => index !== i)
        setAddress(filteredAdress);
    }

    //Form Handler
    const formHandler = () => {
        //pass address and editAddressToggle()
        if (!inputValue) { //only POST api if input field saved
            dispatch(insertUserAddress({ addresses: address, setEditAddressesToggle })); //pass addresses
        }
    }

    return (
        <form onSubmit={handleSubmit(formHandler)} className='shadow-md my-6 px-7 flex flex-col border-[1.5px]'>
            <main className='flex flex-col mb-4 w-full'>

                {/* display adresses saved */}
                {address?.map((element, i) => {
                    return (<div className='mt-6 bg-gray-100 p-2 w-full gap-2 grid'>
                        <div className='flex justify-between p-1'>
                            <p className='text-md text-gray-600'>Address {i + 1}:</p>
                            <div className='flex items-center gap-5'>
                                {/* toggle edit and save button */}
                                {editIndex === i ? // Only toggle between edit and save for selected address, and show edit button for all other addresses
                                    editIndex || editIndex === 0 ? //toggle edit and save button for selected address
                                        <i onClick={() => saveEditAddressHandler(i)} class="fa-solid fa-square-check animate-spin text-2xl scale-150 text-green-500 p-1 "></i>
                                        : <i onClick={() => editIndexHandler(i)} class=" fa-pen-to-square hover:text-11xl text-2xl scale-150 p-1"></i>
                                    : <i onClick={() => editIndexHandler(i)} class="fa-solid fa-pen-to-square hover:scale-125 p-1 "></i>
                                }
                                <i onClick={() => deleteAdressHandler(i)} className="fa-solid fa-trash text-[#ff0000] hover:scale-125  active:text-[#f20000] p-1"></i>
                            </div>
                        </div>

                        {/* diplay input field on edit button else diplay address */}
                        {editIndex === i ?
                            <input type="text" onChange={editInputFieldHandler} defaultValue={address[i]} className='p-1  mr w-full' />
                            : <p className='p-1 w-full text-ellipsis overflow-x-hidden'>{address[i]}</p>
                        }
                    </div>)
                })}

                {/* input field visible for more addresses to add*/}
                {address.length < 3 ?
                    <div className='mt-6 bg-gray-100 p-2 gap-2 grid'>
                        <div className='flex justify-between p-1'>
                            <p className='text-md text-gray-600'>Address {address.length + 1}:</p>
                        </div>
                        <input type="text" value={inputValue} onChange={inputValueHandler} placeholder='Enter address' className='p-1 mr w-full' />
                    </div>
                    : null
                }

                {addressValidationError ? <p className='text-sm text-red-600 my-2'>{addressValidationError}</p> : null}

                {inputValue && address.length < 3 ? <button onClick={() => addAddressHandler()} type="button" className='text-gray-700 my-2 self-center animate-spin text-md scale-125 w-fit'>Add  <i class="fa-solid fa-square-check text-green-500"></i></button> : null}
                {address?.length === 3 ? <p className='text-sm text-red-600 my-2'>Address limit reached.</p> : null}
            </main>
            <div className='flex self-end pb-2'>
                <button onClick={() => setEditAddressesToggle(false)} type='button' class="h-fit mr-4 px-6 mb-[3%] w-fit font-semibold hover:bg-gray-400 hover:text-white text-white active:bg-[#0c544f] active:text-white py-2 bg-red-600">Cancel</button>
                <button type={!editInputField && !inputValue ? "submit" : "button"} class={`${!editInputField && !inputValue ? "bg-green-600 active:bg-green-700 hover:bg-green-500" : "bg-gray-400"}  h-fit  px-6  w-fit font-semibold  hover:text-white text-gray-700  active:text-white py-2  text-white`}>Save</button>
            </div>
        </form >
    )
}

export default EditAddresses;