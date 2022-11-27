
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


export interface chatUser {
    id: string,
    username: string
}

export interface chatsList {
    chats: chatUser[]
}

const initialState: chatsList = {
    chats: []
}


export const chatsListSlice = createSlice({
    name: 'chatsList',
    initialState,
    reducers: {
        setChatsList: (state, action:PayloadAction<chatsList>) => {
            state.chats = action.payload.chats
        },
        resetChatsList: (state) => {
            state.chats = initialState.chats
        }
    }
})

export const { setChatsList, resetChatsList } = chatsListSlice.actions

export default chatsListSlice.reducer