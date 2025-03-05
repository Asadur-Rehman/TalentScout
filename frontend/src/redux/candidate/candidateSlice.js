import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentCandidate: null,
  error: null,
  loading: false,
};

const candidateSlice = createSlice({
  name: "candidate",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentCandidate = action.payload;
      state.loading = false;
      state.error = null;
    },

    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateCandidateStart: (state) => {
      state.loading = true;
    },
    updateCandidateSuccess: (state, action) => {
      state.currentCandidate = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateCandidateFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteCandidateStart: (state) => {
      state.loading = true;
    },
    deleteCandidateSuccess: (state) => {
      state.currentCandidate = null;
      state.loading = false;
      state.error = null;
    },
    deleteCandidateFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signOutCandidateStart: (state) => {
      state.loading = true;
    },
    signOutCandidateSuccess: (state) => {
      state.currentCandidate = null;
      state.loading = false;
      state.error = null;
    },
    signOutCandidateFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateCandidateFailure,
  updateCandidateSuccess,
  updateCandidateStart,
  deleteCandidateFailure,
  deleteCandidateSuccess,
  deleteCandidateStart,
  signOutCandidateFailure,
  signOutCandidateSuccess,
  signOutCandidateStart,
} = candidateSlice.actions;

export default candidateSlice.reducer;
