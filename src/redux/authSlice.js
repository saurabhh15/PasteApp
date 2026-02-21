import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";

export const registerUser = createAsyncThunk("auth/register", async ({ email, password }, { rejectWithValue }) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return { uid: result.user.uid, email: result.user.email };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const loginUser = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { uid: result.user.uid, email: result.user.email };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await signOut(auth);
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    authReady: false,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.authReady = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => { state.loading = true; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        toast.success("Account created! Welcome 👋");
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        const msg = action.payload || "";
        if (msg.includes("email-already-in-use")) toast.error("Email already registered.");
        else if (msg.includes("invalid-email")) toast.error("Invalid email.");
        else toast.error("Registration failed. Try again.");
      })
      .addCase(loginUser.pending, (state) => { state.loading = true; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        toast.success("Logged in!");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        const msg = action.payload || "";
        if (msg.includes("user-not-found") || msg.includes("wrong-password") || msg.includes("invalid-credential"))
          toast.error("Invalid email or password.");
        else toast.error("Login failed. Try again.");
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        toast.success("Logged out.");
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;