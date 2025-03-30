import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import LoadingComp from '../Error&LoadingComponents/LoadingComp'
import { addCart } from '../../reduxToolkit/slices/cartSlice'
import { Link, useNavigate } from 'react-router-dom'
import { addToCart } from '../../reduxToolkit/thunks/cartThunks'

function NewArrivals({ bg }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { data, loading } = useSelector(state => state.productsData);

    //dispatch add to cart thunk
    const addToCartHandler = (productDetails) => {
        dispatch(addToCart({ productDetails, navigate }));
    }

    return (
        <div className={`py-20  px-[7vw] bg-[${bg}]`}>
            <div className='text-center'>
                <h3 className='text-5xl text-gray-900 font-semibold mb-2'>New Arrivals</h3>
                <p className='text-gray-600'>korem ipsum dolor sit amet consectetur. </p>
            </div>

            {/* loading comp on loading:true else display */}
            {loading ? <LoadingComp />
                : <>
                    <div className='flex flex-wrap gap-6 gap-y-12 mt-16 justify-around'>
                        {
                            data.map((element, i) => {

                                // dispaying selected items to show in new arrivals
                                return element.id > 12 && element.id <= 16 ?
                                    <Link key={i} to={`/shop/${element.id}`} >
                                        <div className='w-[17rem] bg-white shadow-xl hover:shadow-2xl px-4 pt-5 pb-3 border-[#cce7d0] rounded-3xl border flex items-center flex-col'>
                                            <img src={element.image} className='h-[15rem] hover:scale-110 duration-150 object-contain ' alt="img" />
                                            <div className='w-full mt-2'>
                                                <p className='text-sm font-medium text-gray-500 pt-2'>{element.category}</p>
                                                <h3 className='line-clamp-1 text-[#1a1a1a] text-md w-full font-semibold'>{element.title}</h3>
                                                <div className='flex gap-1 mt-1 text-orange-400'>
                                                    {
                                                        Array.from(Array(Math.floor(element.rating.rate)), () => {
                                                            return <i class="fa-solid fa-star"></i>
                                                        })
                                                    }
                                                </div>
                                                <div className='flex justify-between my-1 items-center'>
                                                    <h3 className='text-xl font-bold text-[#088178]'><i class="fa-solid fa-dollar-sign text-xl mr-[0.2rem]"></i>{element.price}</h3>
                                                    <Link onClick={() => addToCartHandler({ product_id: element.id, quantity: 1, price: element.price })} className='outline-none active:bg-[#ceffd5e8] hover:scale-110 h-[43px] w-[43px] text-[#088178] rounded-full flex items-center justify-center bg-[#e8f6ea] mr-2'><i class="fa-solid fa-cart-arrow-down"></i></Link>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                    : ''
                            })
                        }
                    </div>
                </>}
        </div>
    )
}

export default NewArrivals