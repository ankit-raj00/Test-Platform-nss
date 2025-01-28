import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login2 as authLogin } from "../Store/authslice"; // Redux action to store user data
import service from "../Appwrite/config"; // Import the service for fetching counsellor details

export default function CouncellorAuth({ children, authentication = true }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(true);

  // Attempt to retrieve the auth status and Enroll from local storage
  const localAuthStatus = JSON.parse(localStorage.getItem("councellor_status"));
  const localEnroll = localStorage.getItem("Enroll");
  const authStatus_counc = useSelector((state) => state.auth.councellor_status);
    console.log(authStatus_counc)
    

  // Get the auth status from Redux store
  

  useEffect(() => {
    const fetchAndSetUserDetails = async () => {
      try {
        if (localEnroll) {
          // Fetch user details based on Enroll from local storage
          const userDetails = await service.getCounsellorDetailsByEnroll(localEnroll);

          if (userDetails.error) {
            console.error(userDetails.error);
            navigate("/councellor/login"); // Redirect to login on error
          } else {
            // Dispatch user details to the Redux store
            
            dispatch(authLogin({cd : userDetails }));
            
          }
        } else {
          console.error("Enroll not found in local storage.");
          navigate("/councellor/login"); // Redirect if no Enroll found
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        navigate("/councellor/login"); // Redirect on failure
      } finally {
        setLoader(false); // Hide the loader after fetching user details
      }
    };
    

    // Set initial state in Redux from local storage (if not already set)
    if (authStatus_counc === undefined && localAuthStatus !== null) {
      dispatch(authLogin(localAuthStatus));
    }

    // Fetch user details if not already in Redux store
    if (!authStatus_counc && localEnroll) {
      fetchAndSetUserDetails();
    } else {
      setLoader(false); // Hide the loader if no fetching is required
    }

    // Check authentication and redirect based on conditions
    if (authentication && authStatus_counc !== authentication) {
      navigate("/councellor/login");
    } else if (!authentication && authStatus_counc === authentication) {
      navigate("/");
    }else if (authentication && authStatus_counc == authentication) {
        navigate("/councellor");
      }
  }, [authStatus_counc, navigate, authentication, dispatch, localAuthStatus, localEnroll]);

  return loader ? <h1>Loading...</h1> : <>{children}</>;
}
