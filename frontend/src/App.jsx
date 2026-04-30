import { Routes, Route } from 'react-router-dom'

// public pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import LoginCompany from './pages/LoginCompany'

// admin pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminStudents from './pages/admin/Students'
import AdminTeachers from './pages/admin/Teachers'
import AdminCompanies from './pages/admin/Companies'
import AdminOffers from './pages/admin/Offers'

// student pages
import StudentOffers from './pages/student/Offers'
import StudentApplications from './pages/student/Applications'
import StudentProfile from './pages/student/Profile'

// teacher pages
import TeacherStudents from './pages/teacher/Students'
import TeacherRecommendations from './pages/teacher/Recommendations'

// company pages
import CompanyMyOffers from './pages/company/MyOffers'
import CompanyCandidates from './pages/company/Candidates'

import PrivateRoute from './components/PrivateRoute'

const App = () => {
  return (
    <Routes>

      {/* public routes — anyone can access */}
      <Route path='/' element={<Landing />} />
      <Route path='/login' element={<Login />} />
      <Route path='/login-company' element={<LoginCompany />} />

      {/* admin routes */}
      <Route path='/admin/dashboard' element={
        <PrivateRoute roles={['admin']}>
          <AdminDashboard />
        </PrivateRoute>
      } />
      <Route path='/admin/students' element={
        <PrivateRoute roles={['admin']}>
          <AdminStudents />
        </PrivateRoute>
      } />
      <Route path='/admin/teachers' element={
        <PrivateRoute roles={['admin']}>
          <AdminTeachers />
        </PrivateRoute>
      } />
      <Route path='/admin/companies' element={
        <PrivateRoute roles={['admin']}>
          <AdminCompanies />
        </PrivateRoute>
      } />
      <Route path='/admin/offers' element={
        <PrivateRoute roles={['admin']}>
          <AdminOffers />
        </PrivateRoute>
      } />

      {/* student routes */}
      <Route path='/student/offers' element={
        <PrivateRoute roles={['student']}>
          <StudentOffers />
        </PrivateRoute>
      } />
      <Route path='/student/applications' element={
        <PrivateRoute roles={['student']}>
          <StudentApplications />
        </PrivateRoute>
      } />
      <Route path='/student/profile' element={
        <PrivateRoute roles={['student']}>
          <StudentProfile />
        </PrivateRoute>
      } />

      {/* teacher routes */}
      <Route path='/teacher/students' element={
        <PrivateRoute roles={['teacher']}>
          <TeacherStudents />
        </PrivateRoute>
      } />
      <Route path='/teacher/recommendations' element={
        <PrivateRoute roles={['teacher']}>
          <TeacherRecommendations />
        </PrivateRoute>
      } />

      {/* company routes */}
      <Route path='/company/offers' element={
        <PrivateRoute roles={['company']}>
          <CompanyMyOffers />
        </PrivateRoute>
      } />
      <Route path='/company/candidates/:offer_id' element={
        <PrivateRoute roles={['company']}>
          <CompanyCandidates />
        </PrivateRoute>
      } />

    </Routes>
  )
}

export default App