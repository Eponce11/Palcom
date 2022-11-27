
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';


export interface currentChatUser {
    id: string,
    username: string,
    messages: any[]
}


const initialState: currentChatUser = {
    id: '',
    username: '',
    messages: []
}

export const currentChatUserSlice = createSlice({
    name: "currentChatUserSlice",
    initialState,
    reducers: {
        setCurrentChatUser: (state, action:PayloadAction<currentChatUser>) => {
            state.id = action.payload.id
            state.username = action.payload.username
            state.messages = action.payload.messages
        },
        resetCurrentChatUser: (state) => {
            state.id = initialState.id
            state.username = initialState.username
            state.messages = initialState.messages
        }
    }
})


export const { setCurrentChatUser, resetCurrentChatUser } = currentChatUserSlice.actions

export default currentChatUserSlice.reducer
