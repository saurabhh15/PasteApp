import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

// Fetch ALL public pastes (no userId exposed — select only safe fields)
export const fetchPastes = createAsyncThunk("paste/fetchPastes", async () => {
  const snapshot = await getDocs(collection(db, "pastes"));
  return snapshot.docs.map((d) => ({
    _id: d.id,
    title: d.data().title,
    content: d.data().content,
    createdAt: d.data().createdAt,
    // ✅ userId is stored in Firestore but NOT returned here → anonymous to public
  }));
});

// Fetch only current user's pastes (for UserPastes page)
export const fetchMyPastes = createAsyncThunk(
  "paste/fetchMyPastes",
  async (uid) => {
    const q = query(collection(db, "pastes"), where("userId", "==", uid));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ ...d.data(), _id: d.id }));
  },
);

// Add paste — stores userId internally (never shown publicly)
export const addPasteToCloud = createAsyncThunk(
  "paste/addPasteToCloud",
  async (paste, { getState, rejectWithValue }) => {
    const { pastes } = getState().paste;
    const { user } = getState().auth;

    if (!user) {
      toast.error("Please login to create a paste!");
      return rejectWithValue("not authenticated");
    }

    if (!paste.title.trim() || !paste.content.trim()) {
      toast.error("Title and content cannot be empty!");
      return rejectWithValue("empty fields");
    }

    const duplicate = pastes.find(
      (p) => p.title.toLowerCase() === paste.title.toLowerCase(),
    );
    if (duplicate) {
      toast.error("A paste with this title already exists!");
      return rejectWithValue("duplicate title");
    }

    // Store userId in Firestore — linked internally, never exposed to public
    const docRef = await addDoc(collection(db, "pastes"), {
      ...paste,
      userId: user.uid, // 🔒 hidden ownership
    });

    return { ...paste, _id: docRef.id };
  },
);

// Update paste — only owner can update
export const updatePasteInCloud = createAsyncThunk(
  "paste/updatePasteInCloud",
  async (paste, { getState, rejectWithValue }) => {
    const { user } = getState().auth;
    if (!user) return rejectWithValue("not authenticated");

    if (!paste.title.trim() || !paste.content.trim()) {
      toast.error("Title and content cannot be empty!");
      return rejectWithValue("empty fields");
    }

    const { _id, ...data } = paste;
    await updateDoc(doc(db, "pastes", _id), data);
    return paste;
  },
);

// Delete paste — only owner can delete
export const deletePasteFromCloud = createAsyncThunk(
  "paste/deletePasteFromCloud",
  async (pasteId, { getState, rejectWithValue }) => {
    const { user } = getState().auth;
    if (!user) return rejectWithValue("not authenticated");

    await deleteDoc(doc(db, "pastes", pasteId));
    return pasteId;
  },
);


const pasteSlice = createSlice({
  name: "paste",
  initialState: {
    pastes: [],
    myPastes: [], // 🔥 ADD THIS
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchPastes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPastes.fulfilled, (state, action) => {
        state.loading = false;
        state.pastes = action.payload;
      })
      .addCase(fetchPastes.rejected, (state) => {
        state.loading = false;
        toast.error("Failed to fetch pastes!");
      })

      // Fetch my pastes
      .addCase(fetchMyPastes.fulfilled, (state, action) => {
        state.myPastes = action.payload;
      })

      // Add
      .addCase(addPasteToCloud.fulfilled, (state, action) => {
        state.pastes.push(action.payload);
        state.myPastes.push(action.payload);
        toast.success("Paste created!");
      })

      // Update
      .addCase(updatePasteInCloud.fulfilled, (state, action) => {
        const idx = state.pastes.findIndex((p) => p._id === action.payload._id);
        if (idx >= 0) state.pastes[idx] = action.payload;
        const myIdx = state.myPastes.findIndex(
          (p) => p._id === action.payload._id,
        );
        if (myIdx >= 0) state.myPastes[myIdx] = action.payload;
        toast.success("Paste updated!");
      })

      // Delete
      .addCase(deletePasteFromCloud.fulfilled, (state, action) => {
        state.pastes = state.pastes.filter((p) => p._id !== action.payload);
        state.myPastes = state.myPastes.filter((p) => p._id !== action.payload);
        toast.success("Paste deleted!");
      })

      .addCase(addPasteToCloud.rejected, (state, action) => {
        if (
          !["empty fields", "duplicate title", "not authenticated"].includes(
            action.payload,
          )
        ) {
          toast.error("Failed to create paste!");
        }
      })
      .addCase(updatePasteInCloud.rejected, (state, action) => {
        if (action.payload !== "empty fields")
          toast.error("Failed to update paste!");
      })
      .addCase(deletePasteFromCloud.rejected, () => {
        toast.error("Failed to delete paste!");
      });
  },
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
