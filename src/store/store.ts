import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./rootReducer"; 

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["columnFilter"],
  // debug: true,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
// store.subscribe(() => {
//   console.log("Redux State Changed:", store.getState());
// });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store); 
export default store;







// import { configureStore } from "@reduxjs/toolkit";
// import userReducer from "./slices/user-slice";
// import filterReducer from "./slices/filter-slice";
// // import applicantReducer from "./slices/create-applicant-slice";

// // Configure the store
// const store = configureStore({
//   reducer: {
//     user: userReducer, 
//     columnFilter: filterReducer,
//     // applicant: applicantReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware(), // Use default middleware
// });


// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// // Export the store
// export default store;
