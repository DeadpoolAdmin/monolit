import ICategories from "@/modules/LiveTV/types/categories.interface";
import { createSlice } from "@reduxjs/toolkit";

const selectedCategorySlice = createSlice({
    name: 'selectedCategory',
    initialState: {
        selectedCategory: null as ICategories | null
    },
    reducers: {
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload
        },
        clearSelectedCategory: (state) => {
            state.selectedCategory = null
        }
    }
})

export const { setSelectedCategory, clearSelectedCategory } = selectedCategorySlice.actions
export default selectedCategorySlice.reducer
