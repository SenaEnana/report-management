import { signIn } from "@/services/AuthService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";


// Define the shape of your user state
interface UserState {
  username: string;
  role: string;
  loading: boolean;
  isAuth: boolean;
  error: string | null;
  token: string | null;
  tokenType: string | null;
  expiresAt: string | null;
}

// Define the initial state
const loadUserDataFromLocalStorage = (): UserState | null => {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData) : null;
};

const saveUserDataToLocalStorage = (userData: UserState) => {
  localStorage.setItem("userData", JSON.stringify(userData));
};

const clearUserDataFromLocalStorage = () => {
  localStorage.removeItem("userData");
};

// Async thunk to fetch user data
export const signInThunk = createAsyncThunk<UserState, { username: string; password: string}>(
  "user/signIn",
  async ({username, password}) => {
    const response = await signIn(username, password);
    if (response) {
      const userDataObj: UserState = {
        username: response.user.username,
        role: response.user.role,
        loading: false,
        error: null,
        isAuth: true,
        token: response.token,
        tokenType: "Bearer",
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
      };

      saveUserDataToLocalStorage(userDataObj);
      return userDataObj;
    } else {
      throw new Error("Failed to fetch user");
    }
  }
);

// Initial state
const initialState: UserState = loadUserDataFromLocalStorage() || {
  username: "",
  role: "user",
  loading: false,
  isAuth:false,
  error: null,
  token: null,
  tokenType: "", 
  expiresAt: ""
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<UserState>) {
      const { username, role, error, loading, token, tokenType, expiresAt, isAuth } = action.payload;
      state.username = username;
      state.role = role;
      state.loading = loading;
      state.error = error;
      state.isAuth = isAuth
      state.token = token;
      state.tokenType = tokenType;
      state.expiresAt = expiresAt;

      saveUserDataToLocalStorage(action.payload);
    },
    signOut(state) {
      state.username = "";
      state.role = "";
      state.loading = false;
      state.isAuth = false;
      state.error = null;
      state.token = null;
      state.tokenType = null;
      state.expiresAt = null;

      clearUserDataFromLocalStorage();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInThunk.pending, (state) => {
        state.loading = true;
        state.username = "";
        state.role = "";
        state.error = null;
        state.isAuth = false;
        state.token = null;
        state.tokenType = null;
        state.expiresAt = null;
      })
      .addCase(signInThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.username = action.payload.username;
        state.role = action.payload.role;
        state.error = null;
        state.isAuth = true;
        state.token = action.payload.token;
        state.tokenType = action.payload.tokenType;
        state.expiresAt = action.payload.expiresAt;
      })
      .addCase(signInThunk.rejected, (state, action) => {
        state.loading = false;
        state.username = "";
        state.role = "";
        state.error = action.error.message || "Failed to fetch user";
        state.isAuth = false;
        state.token = null;
        state.tokenType = null;
        state.expiresAt = null;
      });
  },
});

export const { setUserData, signOut } = userSlice.actions;

// Selector
export const selectUser = (state: { user: UserState }) => state.user;

export default userSlice.reducer;
