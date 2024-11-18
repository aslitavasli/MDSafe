import React from 'react'
import {useState} from 'react'
import axios from 'axios'
import {toast} from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'

export default function RegisterHospitalSystem() {

  const navigate = useNavigate()

  const [data, setData] = useState({
    institutionName:'',
    institutionEmail: '',

  })

  const registerHospitalSystem = async (e) => {
    e.preventDefault()
    const {institutionName, institutionEmail} =data

    try {
      const {data} = await axios.post('/registerhospitalsystem', {institutionName, institutionEmail})
      
      if (data.error){
        toast.error(data.error)
      }
      
      else{
        setData({})
        toast.success('System registered succesfully')
        navigate('/')
      }


    } catch (error) {
      console.log(error)
      
    }
  }

  return (
    <div> 
      <form onSubmit={registerHospitalSystem}>
        <label> Institution Name </label>
        <input type='text' placeholder='Enter name...' value= {data.institutionName} onChange={(e)=> setData({...data, institutionName: e.target.value})}/>

        <label> Email </label>
        <input type='email' placeholder='Enter institutional email...' value= {data.institutionEmail} onChange={(e)=> setData({...data, institutionEmail: e.target.value})}/>

        <button type='submit'> Register Hospital System </button>








      </form>
      
    </div>
  )
}
