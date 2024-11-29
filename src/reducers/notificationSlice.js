import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        addNotification: (state, action) => {
            const { message, type } = action.payload;
            return { message, type };
        },
        clearNotification: () => {
            return null;
        },
    },
});

export const { addNotification, clearNotification } = notificationSlice.actions;

// single thunk for all types of notifications
export const notify = (message, type) => {
    return async (dispatch) => {
        dispatch(addNotification({ message, type }));
        setTimeout(() => {
            dispatch(clearNotification());
        }, 3000);
    };
};

export default notificationSlice.reducer;
