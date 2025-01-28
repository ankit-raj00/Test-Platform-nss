import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  status: false,
  userData: [],
  adminstatus : false,
  adminData : null,
  studentInput: [], // Holds student responses
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload.userData;
      console.log(1 , state.userData)
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
    },
    adminlogin: (state, action) => {
      state.adminstatus = true;
      state.adminData = action.payload.adminData;
    
    },

    adminLogout :(state) => {
      state.adminstatus = false;
      state.adminData = null;
    },
   
    setStudentInput: (state, action) => {
      const newResponse = action.payload;
      state.studentInput = newResponse

     
    },
  },
});

export const { login, logout, adminlogin, adminLogout,  setStudentInput } =
  authSlice.actions;

export default authSlice.reducer;