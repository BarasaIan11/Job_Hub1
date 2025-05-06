import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ApplyJob from './pages/ApplyJob'
import Applications from './pages/Applications'
import RecruiterLogin from './components/RecruiterLogin'
import { AppContext } from './context/AppContext'
import Dashboard from './pages/Dashboard'
import AddJob from './pages/AddJob'
import ManageJobs from './pages/ManageJobs'
import ViewApplications from './pages/ViewApplications'
import 'quill/dist/quill.snow.css'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  const {showRecruiterLogin, companyToken} = useContext(AppContext)
  return (
    <div>
      { showRecruiterLogin && <RecruiterLogin></RecruiterLogin> }
      <ToastContainer></ToastContainer>
      <Routes>
        <Route path='/' element={<Home></Home>}></Route>
        <Route path='/apply-job/:id' element={<ApplyJob></ApplyJob>}></Route>
        <Route path='/applications' element={<Applications></Applications>}></Route>
        <Route path='/dashboard' element={<Dashboard></Dashboard>}>
        {
          companyToken ? <>
          <Route path='add-job' element={<AddJob></AddJob>}></Route>
        <Route path='manage-jobs' element={<ManageJobs></ManageJobs>}></Route>
        <Route path='view-applications' element={<ViewApplications></ViewApplications>}></Route>
          </> : null
        }
        {/* <Route path='add-job' element={<AddJob></AddJob>}></Route>
        <Route path='manage-jobs' element={<ManageJobs></ManageJobs>}></Route>
        <Route path='view-applications' element={<ViewApplications></ViewApplications>}></Route> */}
        </Route>
      </Routes>
      </div>
  )
}

export default App