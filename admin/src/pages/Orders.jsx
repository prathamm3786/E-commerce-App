import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { backendUrl, currency } from '../App'
import { assets } from '../assets/assets'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {
    if (!token) {
      return null
    }
    try {
      const res = await axios.post(backendUrl + "/api/order/list", {}, { headers: { token } })
      if (res.data.success) {
        setOrders(res.data.orders.reverse())
      } else {
        toast.error(res.data.message)
        return
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }
  const statusHandler = async (e, orderId) => {
    try {
      const res = await axios.post(backendUrl + "/api/order/status", { orderId, status: e.target.value }, { headers: { token } })
      if (res.data.success) {
        toast.success(res.data.message)
        await fetchAllOrders()
      }else{
        toast.error(res.data.message)
        return
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)

    }

  }
  useEffect(() => {
    fetchAllOrders()

  }, [token])
  return (
    <div className="p-6">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">Orders</h3>

      <div className="space-y-6">
        {orders.map((order, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-6 grid grid-cols-1 sm:grid-cols-[60px_1fr] gap-4 border border-gray-200"
          >
            {/* Icon */}
            <div className="flex justify-center items-start pt-1">
              <img src={assets.parcel_icon} alt="parcel" className="w-10 h-10" />
            </div>

            {/* Order Details */}
            <div className="flex flex-col space-y-3">
              {/* Items */}
              <div className="text-gray-800 text-sm font-medium">
                {order.items.map((item, i) => (
                  <span key={i}>
                    {item.name} x {item.quantity} ({item.size})
                    {i !== order.items.length - 1 && <span>, </span>}
                  </span>
                ))}
              </div>

              {/* Address */}
              <div className="text-gray-600 text-sm">
                <p>{order.address.firstName} {order.address.lastName}</p>
                <p>{order.address.street}</p>
                <p>{order.address.city}, {order.address.state}, {order.address.country} - {order.address.zipcode}</p>
                <p>📞 {order.address.phone}</p>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                <div>
                  <p><strong>Items:</strong> {order.items.length}</p>
                  <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                  <p><strong>Payment:</strong> {order.payment ? "Done" : "Pending"}</p>
                  <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
                </div>

                {/* Price + Status */}
                <div className="flex sm:flex-col sm:items-end justify-between sm:justify-normal">
                  <p className="text-base font-semibold text-green-700">{currency}{order.amount}</p>
                  <select onChange={(e) => statusHandler(e, order._id)} value={order.status} className="border border-gray-300 rounded px-2 py-1 text-sm mt-2">
                    <option value="Order placed">Order placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

  )
}

export default Orders
