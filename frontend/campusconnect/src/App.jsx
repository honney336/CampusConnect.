import { Route, BrowserRouter as Router, Routes, UNSAFE_RemixErrorBoundary } from 'react-router'
import './App.css'
import Navbar from './Pages/Component/Navbar'
import { Toaster } from 'react-hot-toast'
import Homepage from './Pages/Homepage'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Product from './Pages/Product'
function App() {

  return (
   <Router>
    <Toaster/>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Homepage/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/addproduct' element={<Product/>} />
      {/* <Route path='/dashboard' element={<Dashboard/>} />
      <Route path='/profile' element={<Profile/>} /> */}

    </Routes>
   </Router>
  )
}

export default App
