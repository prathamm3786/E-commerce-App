import { createContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export const ShopContext = createContext()


const ShopContextProvider = (props) => {
    const currency = "$"
    const delivery_fee = 10
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = useState('')
    const [showSearch, setShowSearch] = useState(true)
    const [cartItems, setCartItems] = useState({})
    const [products, setProducts] = useState([])
    const [token, setToken] = useState('')
    // localStorage.getItem('token') ? localStorage.getItem('token') :
    const navigate = useNavigate()


    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error("Please select a size")
            return
        }
        let cartData = structuredClone(cartItems)
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1
            } else {
                cartData[itemId][size] = 1
            }
        } else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }
        setCartItems(cartData)
        if (token) {
            try {
              const res =   await axios.post(backendUrl + "/api/cart/add", { itemId, size }, { headers: { token } })
              if(res.data.success){
                toast.success(res.data.message)
              }
              

            } catch (error) {
                toast.error(error.message)
                console.log(error);
                
            }
        }

    }
    const getCartCount = () => {
        let TotalCount = 0
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item]) {
                        TotalCount += cartItems[items][item]
                    }
                } catch (error) {
                    toast.error(error)
                }
            }
        }
        return TotalCount
    }
    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems)
        cartData[itemId][size] = quantity;
        setCartItems(cartData)
        if (token) {
            try {
                await axios.post(backendUrl + "/api/cart/update", { itemId, size, quantity }, { headers: { token } })
            } catch (error) {
                console.log(error);
                toast.error(error.message)                
            }
        }
    }
    const getCartAmount = () => {
        let totalAmount = 0;
        try {
            for (const items in cartItems) {
                const itemInfo = products.find((product) => product._id === items);
                if (!itemInfo) continue; // skip if product info not available yet
                for (const size in cartItems[items]) {
                    const quantity = cartItems[items][size];
                    if (quantity > 0) {
                        totalAmount += itemInfo.price * quantity;
                    }
                }
            }
        } catch (error) {
            console.error("Error calculating total amount:", error);
            return 0; // fallback to 0
        }
        return totalAmount;
    };
    const getProductsData = async () => {
        try {
            const res = await axios.get(backendUrl + "/api/product/list")
            if (res.data.success) {
                setProducts(res.data.products)
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)

        }
    }
    const getUserCart =async(token) => {
        try {
            const res = await axios.post(backendUrl + "/api/cart/get", {}, {headers : {token}})
            if(res.data.success){
                setCartItems(res.data.cartData)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getProductsData()
    }, [])
    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))

        }
    }, [token])
    
    const value = {
        products, currency, delivery_fee, search, setSearch, showSearch, setShowSearch, cartItems, setCartItems, addToCart, getCartCount, updateQuantity, getCartAmount, navigate
        , backendUrl, getProductsData, token, setToken
    }
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider