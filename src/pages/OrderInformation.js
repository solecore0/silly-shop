import React from 'react'
import { useState } from 'react'

const OrderInformation = () => {
    const [adress , setAddress] = useState("")
    const [payment , setPayment] = useState("")
    const [delivery , setDelivery] = useState("")
    const [coupon , setCoupon] = useState("")
    
  return (
    <div className='registery'>
      <h1>Order Info</h1>

      <div className="inp">
        <input type="text" value={adress} placeholder='Address' onChange={(e) => setAddress(e.target.value)} />
        <input type="text" value={payment} placeholder='Payment' onChange={(e) => setPayment(e.target.value)} />
        <input type="text" value={delivery} placeholder='Delivery' onChange={(e) => setDelivery(e.target.value)} />
        <input type="url" value={coupon} placeholder='Coupon-Code' onChange={(e) => setCoupon(e.target.value)} />
        
        <button>Order</button>
      </div>
    </div>
  )
}

export default OrderInformation
