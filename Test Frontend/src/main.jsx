import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './Store/store.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Login from './Pages/Login.jsx'
import AboutUs from './Pages/AboutUs.jsx'

import Home from './Pages/Home.jsx'
import Signup from './Pages/Signup.jsx'
import AuthLayout from './Components/AuthLayout.jsx'

import QuestionViewer from './Pages/Test.jsx'
import AllTest from './Pages/AllTest.jsx'
import Testpage from './Pages/Test1.jsx'
import TestAuth from './Components/TestAuth.jsx'
import AdminDash from './Pages/AdminDash.jsx'
import TestCreat from './Pages/TestCreat.jsx'
import EditTest from './Pages/EditTest.jsx'
import AdminLogin from './Pages/AdminLogin.jsx'
import AdminSignup from './Pages/AdminSignup.jsx'
import UserProfile from './Pages/UserProfile.jsx'
import TestAnalysis from './Pages/TestAnalysis.jsx'
import TestQuestions from './Pages/TestQuestions.jsx'
import GraphAnalysisPage from './Pages/GraphAnalysis.jsx'
import BookmarkedQuestions from './Pages/BookmarkedQuestion.jsx'
import UsersPage from './Pages/AllUserInfo.jsx'
import AdminAuthLayout from './Components/AdminAuth.jsx'




const router = createBrowserRouter([
    {
      path: "/",
      element: <App />, // Main layout component that wraps all other components
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/signup",
          element: <Signup />,
        },
        
        {
          path: "/test/:id", // Dynamic path for the test with name
          element: (
          <TestAuth>
            <Testpage />
          </TestAuth>
        ),
        },
        {
          path: "/all-test", // Dynamic path for the appointment with name
          element: (
            <AuthLayout>
          <AllTest />
          </AuthLayout>
        )
        },
        {
          path: "/admin-Dash",
          element: (
          <AdminAuthLayout>
          <AdminDash />
          </AdminAuthLayout>
        ),
          
        },
        {
          path: "/admin-Dash/create-test",
          element:( 
          <AdminAuthLayout>
          <TestCreat />
          </AdminAuthLayout>
        ),
        },
        {
          path : "/admin-dash/login",
          element : <AdminLogin />
        },
        {
            path : "/admin-dash/signup",
            element : <AdminSignup />
          
        },
        {
          path: "/edit-test/:id",
          element: (
          <AdminAuthLayout>
          <EditTest />
          </AdminAuthLayout>
        ),
        },
        {
          path: "/about-us",
          element: <AboutUs />,
        },{
          path : "/profile", 
          element : (
            <AuthLayout>
          <UserProfile />
          </AuthLayout>
        )
        },
        {
          path : "/test-analysis/:id",
          element : (
          <AuthLayout>
          <TestAnalysis />
          </AuthLayout>
        )
        },
        {
          path : "/graph-analysis/:id",
          element : (
          <AuthLayout>
          <GraphAnalysisPage />
          </AuthLayout>
          )
        },
        {
          path : '/test-analysis/:id/all-question/:testId',
          element : (
          <AuthLayout>
          <TestQuestions />
          </AuthLayout>
        )
        },
        {
          path : '/bookmarked-question',
          element : (
          <AuthLayout>
          <BookmarkedQuestions />
          </AuthLayout>
        )
        },{
          path:'/all-user',
          element : (
          <AdminAuthLayout>
          <UsersPage />
          </AdminAuthLayout>
        )
        }
        
      ],
    },
  ]);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store = {store}>
    <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
)
