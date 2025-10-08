import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Filter {
  column: string;
  operator: string;
  value: string;
}

interface FilterState {
  filters: Filter[];
  isFilterLoading: boolean;
  isFilterModalOpen: boolean;
  pageIndex: number;
  pageSize: number;
  tableData: any[];
  totalItems: number;
}

const initialState: FilterState = {
  filters: [{ column: "", operator: "=", value: "" }],
  isFilterModalOpen: false,
  isFilterLoading: false,
  pageIndex: 0,
  pageSize: 10,
  tableData: [],
  totalItems: 0,
};

export const filterSlice = createSlice({
  name: "columnFilter",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<{ index: number; key: string; value: any }>) => {
      const { index, key, value } = action.payload;
      state.filters = state.filters.map((filter, i) =>
        i === index ? { ...filter, [key]: value } : filter
      );
    },
    setPagination: (state, action) => {
      state.pageIndex = action.payload.pageIndex;
      state.pageSize = action.payload.pageSize;
    },
    setTotalItems: (state, action) => {
      state.totalItems = action.payload;
    },
    setPageIndex: (state, action: PayloadAction<number>) => {
      state.pageIndex = action.payload;
    },
    // addFilter: (state) => {
    //   state.filters.push({ column: "", operator: "=", value: "" });
    // },
    removeFilter: (state, action: PayloadAction<number>) => {
      state.filters = state.filters.filter((_, i) => i !== action.payload);
    },
    clearFilters: (state) => {
      state.filters = [{ column: "", operator: "=", value: "" }];
      state.tableData = [];
      state.totalItems = 0;
      state.isFilterModalOpen = false;
    },
    applyFilters: (state, action: PayloadAction<{ tableData: any[]; totalItems: number }>) => {
      state.tableData = action.payload.tableData;
      state.totalItems = action.payload.totalItems;
    },
    toggleFilterModal: (state) => {
      state.isFilterModalOpen = !state.isFilterModalOpen;
    },
    setIsFilterLoading: (state, action: PayloadAction<boolean>) => {
      state.isFilterLoading = action.payload;
    },
  },
});

export const {
  setFilters,
  removeFilter,
  clearFilters,
  applyFilters,
  toggleFilterModal,
  setIsFilterLoading,
  setPagination,
  setPageIndex,
  setTotalItems,
} = filterSlice.actions;

export default filterSlice.reducer;