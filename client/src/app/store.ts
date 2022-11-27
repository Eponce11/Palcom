
import { configureStore } from "@reduxjs/toolkit";


import signedInUserSlice from "../features/signedInUserSlice";
import currentChatUserSlice from "../features/currentChatUserSlice";
import chatsListSlice from "../features/chatsListSlice";

export const store = configureStore({
    reducer: {
        currentChatUser: currentChatUserSlice,
        chatsList: chatsListSlice,
        signedInUser: signedInUserSlice
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch