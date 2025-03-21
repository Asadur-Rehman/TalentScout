import { combineReducers, configureStore } from "@reduxjs/toolkit";
import recruiterReducer from "./recruiter/recruiterSlice";
import candidateReducer from "./candidate/candidateSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  recruiter: recruiterReducer,
  candidate: candidateReducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  whitelist: ["recruiter", "candidate"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
