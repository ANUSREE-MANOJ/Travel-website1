import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromChildren } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import Login from './pages/Auth/Login.jsx'
import Register from './pages/Auth/Register.jsx'
import AdminRoute from './pages/Admin/AdminRoute.jsx'
import UserList from './pages/Admin/UserList.jsx'
import AgentRoute from './pages/Agent/AgentRoute.jsx'
import AllPackages from './pages/Agent/AllPackages.jsx'
import AddPackage from './pages/Agent/AddPackage.jsx'
import Home from './components/Home.jsx'
import PackageDeatils from './pages/Packages/PackageDeatils.jsx'
import HotelDetails from './pages/Packages/HotelDetails.jsx'
import AddHotels from './pages/Agent/AddHotels.jsx'
import MultiStepForm from './components/MultiStepForm/MultiStepForm.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import Profile from './pages/User/Profile.jsx'
import ALLHotels from './pages/Admin/ALLHotels.jsx'
import PackageList from './pages/Admin/PackageList.jsx'
import HotelEdits from './pages/Agent/HotelEdits.jsx'
import PackageEdits from './pages/Agent/PackageEdits.jsx'
import Dashboard from './pages/Admin/Dashboard.jsx'
import OrderList from './pages/Admin/OrderList.jsx'
import Orders from './pages/User/Orders.jsx'
import DisplayPage from './pages/User/Profile/DisplayPage.jsx'
import ErrorBoundary from '../ErrorBoundary.jsx'
import { ToastContainer } from 'react-toastify'

const router = createBrowserRouter(
  createRoutesFromChildren(
    <Route  path='/'  element={<App/>}  >   
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />}  />
    <Route  index={true} path='/'  element={<Home/>}    />
    <Route  index={true} path="/packages"  element={<AllPackages/>}  />
    <Route   path="/package/:id" element={<PackageDeatils/>}  />
    <Route path='/place/:id/hotels'  element={<HotelDetails/>}/>
    <Route path='/book/:id' element={<MultiStepForm/>}/>
    
    
    <Route  path=''  element={<PrivateRoute/>} >
    <Route path="/profile" element={<DisplayPage/>} />
    <Route  path='/user-orders' element={<Orders/>} />
    </Route>


    <Route  path="/admin" element={<AdminRoute/>}  >
    <Route path="userlist" element={<UserList/>} />
    <Route   path='hotels'   element={<ALLHotels/>}   />
    <Route path='packages' element={<PackageList/>} />
     <Route  path='dashboard' element={<Dashboard/>} />
     <Route  path='orders'   element={<OrderList/>}   />
    </Route>

    <Route path='/agent' element={<AgentRoute/>} >
      <Route path='AddPackage' element={<AddPackage/>}  />
      <Route path='addhotel'  element={<AddHotels/>} />
       <Route path='hotels' element={<HotelEdits/>} />
       <Route path='package'   element={<PackageEdits/>}      />
</Route>
    </Route> 
  
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider   store={store}>
 <React.StrictMode>
  <ErrorBoundary>
  <RouterProvider router={router}   />
  <ToastContainer/> {/* Add ToastContainer here */}

  </ErrorBoundary>
  </React.StrictMode>
  </Provider>
  
)


