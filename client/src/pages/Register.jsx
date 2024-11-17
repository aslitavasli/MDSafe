import React from 'react'
import {useState} from 'react'
import axios from 'axios'
import {toast} from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'
import Select from 'react-select';

export default function Register() {
  
  const navigate = useNavigate()

  const [data, setData] = useState({
    name:'',
    surname: '',
    email: '',
    location: '',
    password: ''

  })

  const institutions = [
    { value: 'Dartmouth College', label: 'Dartmouth College' },
    { value: 'Upper Arlington High School', label: 'Upper Arlington High School' },
    { value: 'Dropout College', label: 'Dropout College' },
    // Add more institutions as needed
];


// const handleInstitutionChange = async (selectedOption) => {
//   setData({ ...data, institution: selectedOption.value });
  
//   try {
//       const response = await axios.get(`/api/libraries?name=${selectedOption.value}`);
//       const library = response.data;

//       setData({ ...data, institution: library._id });
//   } catch (error) {
//       console.error('Error fetching library:', error);
//   }
// };is


  const registerUser = async (e) => {
    e.preventDefault()
    const {name, surname, location, email, password, institution} =data

    try {
      const {data} = await axios.post('/independentuser', {name, surname, location, email, password, institution})
      
      if (data.error){
        toast.error(data.error)
      }
      
      else{
        setData({})
        toast.success('User registered succesfully')
        navigate('/')
      }


    } catch (error) {
      console.log(error)
      
    }
  }

  return (
    <div> 
      <form onSubmit={registerUser}>
        <label> Name </label>
        <input type='text' placeholder='Enter name...' value= {data.name} onChange={(e)=> setData({...data, name: e.target.value})}/>

        <label> Surname </label>
        <input type='text' placeholder='Enter surname...'value= {data.surname} onChange={(e)=> setData({...data, surname: e.target.value})}/>

        <label> Email </label>
        <input type='email' placeholder='Enter institutional email...' value= {data.email} onChange={(e)=> setData({...data, email: e.target.value})}/>

        <label> Password </label>
        <input type='password' placeholder='Enter password..'value= {data.password} onChange={(e)=> setData({...data, password: e.target.value})}/>
        
        <label> Location </label>
        <input type='text' placeholder='Enter primary location' value= {data.location} onChange={(e)=> setData({...data, location: e.target.value})}/>

        <label>Institution</label>
    <Select
        options={institutions}
        onChange={(selectedOption) => setData({ ...data, institution: selectedOption.value })}
        placeholder="Select or type institution..."
        isSearchable
    />

        <button type='submit'> Register User </button>








      </form>
      
    </div>
  )
}
