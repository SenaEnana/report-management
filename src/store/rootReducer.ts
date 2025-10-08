import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slices/user-slice";
import filterReducer from "./slices/filter-slice";
// import applicantReducer from "./slices/create-applicant-slice";

const rootReducer = combineReducers({
    user: userReducer,
    columnFilter: filterReducer,
    // applicant: applicantReducer,
});

export default rootReducer;
