import { configureStore } from "@reduxjs/toolkit";
import personaReducer from "./personaSlice";

const store = configureStore({
  reducer: {
    personas: personaReducer,
  },
});

export default store;
