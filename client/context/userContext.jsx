import axios from 'axios'
import { createContext, useEffect, useState} from 'react'

export const UserContext = createContext({})

export function UserContextProvider({children}){
    const [user, setUser] = useState(null)
    useEffect(()=> {
        if (!user){
            axios.get('/profile').then(({data}) => {
                setUser(data)
            })
        }
    }, [])


  const logoutUser = async () => {
    try {
      await axios.post('/logout');
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

    return(
        <UserContext.Provider value ={{user, setUser, logoutUser}}>
            {children}
        </UserContext.Provider>
    )
}