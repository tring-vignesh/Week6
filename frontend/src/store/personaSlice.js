import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  personas: [],
};

const personaSlice = createSlice({
  name: "personas",
  initialState,
  reducers: {
    setPersonas: (state, action) => {
      state.personas = action.payload;
    },
    addPersona: (state, action) => {
      state.personas.push(action.payload);
    },
    updatePersona: (state, action) => {
      const { index, updatedPersona } = action.payload;
      state.personas[index] = updatedPersona;
    },
    deletePersona: (state, action) => {
      state.personas.splice(action.payload, 1);
    },
  },
});

export const { setPersonas, addPersona, updatePersona, deletePersona } = personaSlice.actions;
export default personaSlice.reducer;
