import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { signupUser } from '../redux/user'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'


const SignUp = () => {
  const [name , setName] = useState("")
  const [password , setPassword] = useState("")
  const [email , setEmail] = useState("")
  const [photo, setPhoto] = useState("")
  const [dob , setDob] = useState("")
  const [gender , setGender] = useState("")

  const navigate = useNavigate()

  const dispatch = useDispatch()
  const handleSubmit = async(e) => {
    e.preventDefault()
   await dispatch(signupUser({ name , password , email , photo , dob , gender }))
   if (localStorage.getItem('token')) {
      navigate('/')
      window.location.reload()
    }
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }
  console.log(name , password , email , photo , dob)
  return (
    <div className='registery' onKeyDown={handleKeyDown}>
      <h1>Sign-up</h1>

      <div className="inp">
        <input type="text" value={name} placeholder='Username' onChange={(e) => setName(e.target.value)} />
        <input type="text" value={email} placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
        <input type="text" value={password} placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
        <input type="url" value={photo} placeholder='Profile-Pic' onChange={(e) => setPhoto(e.target.value)} />
        <input type="date" value={dob} placeholder='Birthday' onChange={(e) => setDob(e.target.value)} /> 
        <select 
          value={gender} 
          onChange={(e) => setGender(e.target.value)}
          className="gender-select"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <button onClick={handleSubmit}>Sign-up</button>
      </div>
      <hr />
      <div className="sin">
        <p>Already have an account ?</p>
        <Link to="/login">Log-in</Link>
      </div>
    </div>
  )
}

export default SignUp
