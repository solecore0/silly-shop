import React  from 'react'
import { useNavigate } from 'react-router-dom'


const Card = ({item}) => {

  const navigate = useNavigate();

const goToProduct = () => {
  navigate(`/product/${item._id}`);
};
  
  return (
    <div className="card">
      <div className="im"><img src={`http://localhost:4000/${item.photo}`} alt="" />  </div>
        <h3>{item.name}</h3>
        <p>${item.price}</p>
        <button className='btn' onClick={goToProduct} >Show More</button>
    </div>
  )
}

export default Card
