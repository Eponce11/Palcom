
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface signedInUserState {
    id: string,
    username: string,
}

const initialState: signedInUserState = {
    id: "",
    username: ""
}


export const signedInUserSlice = createSlice({
    name: 'signedInUser',
    initialState,
    reducers: {
        setSignedInUser: (state, action:PayloadAction<signedInUserState>) => {
            state.id = action.payload.id
            state.username = action.payload.username
        },
        resetSignedInUser: (state) => {
            state.id = initialState.id
            state.username = initialState.username
        }
    }
})


export const { setSignedInUser, resetSignedInUser } = signedInUserSlice.actions

export default signedInUserSlice.reducer