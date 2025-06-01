import React, { useContext } from 'react'
import { BrowserRouter as Router, Route, Routes, Outlet, Navigate } from 'react-router-dom'
// user
import UserDashboard from './pages/Users/UserDashboard'
import ViewTasksDetails from './pages/Users/ViewTasksDetails'
import MyTasks from './pages/Users/MyTasks'
// admin
import Dashboard from './pages/Admin/Dashboard'
import CreateTask from './pages/Admin/CreateTask'
import ManageTasks from './pages/Admin/ManageTasks'
import ManageUsers from './pages/Admin/ManageUsers'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'


import PrivateRoute from './routes/PrivateRoute'
import UserProvider, { UserContext } from './context/userContext'
import { Toaster } from 'react-hot-toast'
const App = () => {
  return (
    <UserProvider>
    <div>
      <Router>
        <Routes>
          {/* <Route path="/" element={<h1>Home</h1>} /> */}
          <Route path="/login" element={<Login/>} />
          <Route path="/signUp" element={<SignUp/>} />


          {/* admin routes */}
          <Route  element={<PrivateRoute allowedRoles={["admin"]} /> }> 
          <Route path='/admin/dashboard' element={<Dashboard/>} />
          <Route path="/admin/tasks" element={<ManageTasks/>} />
          <Route path="/admin/create-task" element={<CreateTask/>} />
          <Route path="/admin/users" element={<ManageUsers/>} />
          </Route>

          {/* user routes */}
          <Route  element={<PrivateRoute allowedRoles={["member", "admin"]} /> }>
          <Route path="/user/dashboard" element={<UserDashboard/>} />
          <Route path="/user/tasks" element={<MyTasks/>} />
          <Route path="/user/tasks-details/:id" element={<ViewTasksDetails/>} />
       
       

       </Route>

      {/* // default route */}

      <Route path='/' element={<Root />} />

        </Routes>
      </Router>
    </div>

    <Toaster
    toastOptions={{
      className:"",
      style:{
        fontSize:"13px"
      }
    }}
    />
    </UserProvider>
    
  )
}

export default App


const Root=()=>{
  const {user,loading}= useContext(UserContext);

  if(loading)return <Outlet/>
  if(!user){
    return <Navigate to="/login"/>
  }

  return user.role === "admin"? <Navigate to="/admin/dashboard"/> : <Navigate to="/user/dashboard"/>
}