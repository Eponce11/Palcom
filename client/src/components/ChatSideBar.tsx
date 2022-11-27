import React, { useEffect } from "react";
import axios from "axios";
import styles from "./styles/ChatSideBar.module.css"

import type { RootState } from "../app/store";

import { useSelector, useDispatch } from "react-redux";

import { setChatsList } from "../features/chatsListSlice";
import type { chatUser, chatsList } from "../features/chatsListSlice";
import { setCurrentChatUser } from "../features/currentChatUserSlice";
import type { currentChatUser } from "../features/currentChatUserSlice";



const ChatSideBar = () => {
    axios.defaults.withCredentials = true;

    const chatsList:chatUser[] = useSelector((state:RootState) => state.chatsList.chats)
    const dispatch = useDispatch();


    useEffect( () => {
        axios.get("http://localhost:8000/api/user/getAllChats", { withCredentials: true })
            .then( (res) => {
                const tempChatsList: chatsList = { chats: [] }
                for (const chat of res.data.chats) {
                    tempChatsList.chats.push({
                        id: chat._id,
                        username: chat.username
                    })
                }
                dispatch(setChatsList(tempChatsList));
            })
            .catch( (err) => console.log(err.response.data));
    }, [dispatch])

    const openChat = (to: string, username: string): any => {
        axios.post("http://localhost:8000/api/message/getAllChatMessages", { to: to }, { withCredentials: true })
            .then( (res) => {
                console.log(res.data)
                dispatch(setCurrentChatUser({
                    id: to,
                    username: username,
                    messages: res.data
                }))
            })
            .catch( (err) => console.log(err))
    }

    return (
        <ul className={styles.chatTab}>
            {
                chatsList.map( (chat:chatUser, idx:number) => {
                    return (
                        <li onClick={ () => { openChat(chat.id, chat.username) }} className={styles.selectChat} key={idx}>
                            <div className={styles.fakeImg}></div>
                            <h3>{chat.username}</h3>
                        </li>
                    )
                })
            }
        </ul>
    )
}


export default ChatSideBar;