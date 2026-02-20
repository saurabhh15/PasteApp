import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast';

const initialState = {
  pastes: localStorage.getItem("pastes") 
    ? JSON.parse(localStorage.getItem("pastes"))
    : []
}

export const pasteSlice = createSlice({
  name: 'paste',
  initialState,
  reducers: {
    addToPastes: (state, action) => {
      const paste = action.payload;

      //Check for empty title or content
      if (!paste.title.trim() || !paste.content.trim()) {
        toast.error("Title and content cannot be empty!");
        return;
      }

      //Check for duplicate title
      const duplicate = state.pastes.find(
        (item) => item.title.toLowerCase() === paste.title.toLowerCase()
      );
      if (duplicate) {
        toast.error("A paste with this title already exists!");
        return;
      }

      state.pastes.push(paste);
      localStorage.setItem("pastes", JSON.stringify(state.pastes));
      toast.success("Paste created successfully!");
    },

    updateToPastes: (state, action) => {
      const paste = action.payload;

      //Check for empty title or content on update too
      if (!paste.title.trim() || !paste.content.trim()) {
        toast.error("Title and content cannot be empty!");
        return;
      }

      const index = state.pastes.findIndex((item) => item._id === paste._id);

      if (index >= 0) {
        state.pastes[index] = paste;
        localStorage.setItem("pastes", JSON.stringify(state.pastes)); //key "pastes"
        toast.success("Paste updated!");
      }
    },

    resetAllPastes: (state, action) => {
      state.pastes = [];
      localStorage.removeItem("pastes");
    },

    removeFromPastes: (state, action) => {
      const pasteId = action.payload;

      const index = state.pastes.findIndex((item) => item._id === pasteId);

      if (index >= 0) {
        state.pastes.splice(index, 1);
        localStorage.setItem("pastes", JSON.stringify(state.pastes));
        toast.success("Paste deleted!");
      }
    }
  },
})

export const { addToPastes, updateToPastes, resetAllPastes, removeFromPastes } = pasteSlice.actions

export default pasteSlice.reducer