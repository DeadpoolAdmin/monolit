import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BasketItem {
    id: number | string;
    name: string;
    price: number;
    quantity: number;
}

export interface BasketState {
    items: BasketItem[];
}

const initialState: BasketState = {
    items: [],
};

const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<Omit<BasketItem, 'quantity'> & { quantity?: number }>) => {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.id === newItem.id);

            if (existingItem) {
                existingItem.quantity += newItem.quantity ?? 1;
            } else {
                state.items.unshift({ ...newItem, quantity: newItem.quantity ?? 1 });
            }
        },
        removeItem: (state, action: PayloadAction<number | string>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
        clearBasket: (state) => {
            state.items = [];
        },
        getBasket: (state, action: PayloadAction<BasketItem[]>) => {
            state.items = action.payload
        },
        setQuantity: (state, action: PayloadAction<{ id: number | string, quantity: number }>) => {
            const item = state.items.find(item => item.id === action.payload.id)
            if (item) {
                item.quantity = action.payload.quantity
            }
        }
    },
});

export const { addItem, removeItem, clearBasket, getBasket, setQuantity } = basketSlice.actions;
export default basketSlice.reducer;
