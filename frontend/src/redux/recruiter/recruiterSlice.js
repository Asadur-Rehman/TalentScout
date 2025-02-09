import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentRecruiter: null,
  error: null,
  loading: false,
};

const recruiterSlice = createSlice({
  name: "recruiter",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentRecruiter = action.payload;
      state.loading = false;
      state.error = null;
    },

    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateRecruiterStart: (state) => {
      state.loading = true;
    },
    updateRecruiterSuccess: (state, action) => {
      state.currentRecruiter = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateRecruiterFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteRecruiterStart: (state) => {
      state.loading = true;
    },
    deleteRecruiterSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteRecruiterFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signOutRecruiterStart: (state) => {
      state.loading = true;
    },
    signOutRecruiterSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    signOutRecruiterFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateRecruiterFailure,
  updateRecruiterSuccess,
  updateRecruiterStart,
  deleteRecruiterFailure,
  deleteRecruiterSuccess,
  deleteRecruiterStart,
  signOutRecruiterFailure,
  signOutRecruiterSuccess,
  signOutRecruiterStart,
} = recruiterSlice.actions;

export default recruiterSlice.reducer;
