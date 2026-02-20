import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

// Fetch all pastes from Firestore
export const fetchPastes = createAsyncThunk('paste/fetchPastes', async () => {
  const snapshot = await getDocs(collection(db, 'pastes'));
  return snapshot.docs.map((doc) => ({ ...doc.data(), _id: doc.id }));
});

// Add paste to Firestore
export const addPasteToCloud = createAsyncThunk('paste/addPasteToCloud', async (paste) => {
  const docRef = await addDoc(collection(db, 'pastes'), paste);
  return { ...paste, _id: docRef.id };
});

// Update paste in Firestore
export const updatePasteInCloud = createAsyncThunk('paste/updatePasteInCloud', async (paste) => {
  const { _id, ...data } = paste;
  await updateDoc(doc(db, 'pastes', _id), data);
  return paste;
});

// Delete paste from Firestore
export const deletePasteFromCloud = createAsyncThunk('paste/deletePasteFromCloud', async (pasteId) => {
  await deleteDoc(doc(db, 'pastes', pasteId));
  return pasteId;
});

const pasteSlice = createSlice({
  name: 'paste',
  initialState: {
    pastes: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchPastes.pending, (state) => { state.loading = true; })
      .addCase(fetchPastes.fulfilled, (state, action) => {
        state.loading = false;
        state.pastes = action.payload;
      })
      .addCase(fetchPastes.rejected, (state) => { state.loading = false; })

      // Add
      .addCase(addPasteToCloud.fulfilled, (state, action) => {
        state.pastes.push(action.payload);
        toast.success("Paste created!");
      })

      // Update
      .addCase(updatePasteInCloud.fulfilled, (state, action) => {
        const index = state.pastes.findIndex((p) => p._id === action.payload._id);
        if (index >= 0) state.pastes[index] = action.payload;
        toast.success("Paste updated!");
      })

      // Delete
      .addCase(deletePasteFromCloud.fulfilled, (state, action) => {
        state.pastes = state.pastes.filter((p) => p._id !== action.payload);
        toast.success("Paste deleted!");
      })
  }
});

export default pasteSlice.reducer;







// import { createSlice } from '@reduxjs/toolkit'
// import toast from 'react-hot-toast';

// const initialState = {
//   pastes: localStorage.getItem("pastes") 
//     ? JSON.parse(localStorage.getItem("pastes"))
//     : []
// }

// export const pasteSlice = createSlice({
//   name: 'paste',
//   initialState,
//   reducers: {
//     addToPastes: (state, action) => {
//       const paste = action.payload;

//       // Check for empty title or content
//       if (!paste.title.trim() || !paste.content.trim()) {
//         toast.error("Title and content cannot be empty!");
//         return;
//       }

//       //Check for duplicate title
//       const duplicate = state.pastes.find(
//         (item) => item.title.toLowerCase() === paste.title.toLowerCase()
//       );
//       if (duplicate) {
//         toast.error("A paste with this title already exists!");
//         return;
//       }

//       state.pastes.push(paste);
//       localStorage.setItem("pastes", JSON.stringify(state.pastes));
//       toast.success("Paste created successfully!");
//     },

//     updateToPastes: (state, action) => {
//       const paste = action.payload;

//       //Check for empty title or content on update too
//       if (!paste.title.trim() || !paste.content.trim()) {
//         toast.error("Title and content cannot be empty!");
//         return;
//       }

//       const index = state.pastes.findIndex((item) => item._id === paste._id);

//       if (index >= 0) {
//         state.pastes[index] = paste;
//         localStorage.setItem("pastes", JSON.stringify(state.pastes)); //key "pastes"
//         toast.success("Paste updated!");
//       }
//     },

//     resetAllPastes: (state, action) => {
//       state.pastes = [];
//       localStorage.removeItem("pastes");
//     },

//     removeFromPastes: (state, action) => {
//       const pasteId = action.payload;

//       const index = state.pastes.findIndex((item) => item._id === pasteId);

//       if (index >= 0) {
//         state.pastes.splice(index, 1);
//         localStorage.setItem("pastes", JSON.stringify(state.pastes));
//         toast.success("Paste deleted!");
//       }
//     }
//   },
// })

// export const { addToPastes, updateToPastes, resetAllPastes, removeFromPastes } = pasteSlice.actions

// export default pasteSlice.reducer