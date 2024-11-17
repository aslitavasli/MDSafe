import {Link} from 'react-router-dom'
import Logout from './Logout'


export default function Navbar() {
  return (
    <nav>
      <Link to='/'>Home </Link>
      <Link to='/register'>Register User </Link>
      <Link to='/login'>Login </Link>
      <Link to='/editusers'>Edit Users </Link>
      <Link to='/registerlibsystem'>Register Library System </Link>
      <Logout />

    </nav>
  )
}
