import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import toast from 'react-hot-toast'

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod')
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  })
  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  const initPay = (order) => {
    const options ={ 
      key : import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount : order.amount,
      currency : order.currency,
      name: "Order Payment",
      description : "Order Payment",
      order_id : order.id,
      receipt: order.receipt,
      handler : async (response) => {
        try {
          const {data} = await axios.post(backendUrl + "/api/order/verifyRazorpay", response, { headers: { token } })
          if(data.success){
            navigate('/orders')
            setCartItems({})
            toast.success(data.message)
          }
        } catch (error) {
          console.log(error); 
          toast.error(error.message)
          
        }
        
      }

    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      let orderItems = []
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items))
            if (itemInfo) {
              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      }
      switch (method) {
        case 'cod':
          const res = await axios.post(backendUrl + "/api/order/place", orderData, { headers: { token } })
          if (res.data.success) {
            toast.success(res.data.message)
            setCartItems({})
            navigate('/orders')
          } else {
            toast.error(res.data.message)

          }
          break;
        case 'stripe':
            const resStripe = await axios.post(backendUrl + "/api/order/stripe", orderData, { headers: { token } })
            if (resStripe.data.success) {
              const {session_url} = resStripe.data
              window.location.replace(session_url)
            }else{
              toast.error(resStripe.data.message)
            }
          break;
          case 'razorpay':
            const resRazorpay = await axios.post(backendUrl + "/api/order/razorpay", orderData, { headers: { token } })
            if (resRazorpay.data.success) {
              if(resRazorpay.data.success){
               initPay(resRazorpay.data.order)
                
              }
              else{
                console.log(resRazorpay.data.message);
                
              }
            }
            break;
        default:
          break;
      }



    } catch (error) {
      console.log(error);
      toast.error(error.message)

    }
  }
  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col justify-between sm:flex-row gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t border-gray-200'>
      {/* left side    */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="flex gap-3">
          <input onChange={onChangeHandler} name='firstName' value={formData.firstName} type="text" placeholder='First Name' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' required />
          <input onChange={onChangeHandler} name='lastName' value={formData.lastName} type="text" placeholder='Last Name' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' required />
        </div>
        <input onChange={onChangeHandler} name='email' value={formData.email} type="email" placeholder='your@email.com' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' required />
        <input onChange={onChangeHandler} name='street' value={formData.street} type="text" placeholder='Street name' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' required />
        <div className="flex gap-3">
          <input onChange={onChangeHandler} name='city' value={formData.city} type="text" placeholder='City' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' required />
          <input onChange={onChangeHandler} name='state' value={formData.state} type="text" placeholder='State' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' required />
        </div>
        <div className="flex gap-3">
          <input onChange={onChangeHandler} name='zipcode' value={formData.zipcode} type="number" placeholder='Zipcode' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' required />
          <input onChange={onChangeHandler} name='country' value={formData.country} type="text" placeholder='Country' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' required />
        </div>
        <input onChange={onChangeHandler} name='phone' value={formData.phone} type="number" placeholder='Phone no.' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' required />

      </div>
      {/* Right side */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>
        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />

          {/* payment method */}
          <div className="flex gap-3 flex-col sm:flex-row">
            <div onClick={() => setMethod('stripe')} className="flex items-center gap-3 p-2 border border-gray-200 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full border-gray-200  ${method === 'stripe' ? 'bg-green-400' : ''} `}></p>
              <img src={assets.stripe_logo} className='h-5 mx-4' alt="" />
            </div>
            <div onClick={() => setMethod('razorpay')} className="flex items-center gap-3 p-2 border border-gray-200 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full border-gray-200 ${method === 'razorpay' ? 'bg-green-400' : ''} `}></p>
              <img src={assets.razorpay_logo} className='h-5 mx-4' alt="" />
            </div>
            <div onClick={() => setMethod('cod')} className="flex items-center gap-3 p-2 border border-gray-200 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full border-gray-200 ${method === 'cod' ? 'bg-green-400' : ''} `}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>
          <div className="w-full text-end mt-8">
            <button type='submit' className='bg-black text-white px-16 py-3 text-sm '> PLACE ORDER</button>
          </div>
        </div>
      </div>


    </form>
  )
}

export default PlaceOrder
