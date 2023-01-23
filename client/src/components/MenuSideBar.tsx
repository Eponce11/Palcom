import React from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

import styles from "./styles/MenuSideBar.module.css"

import { useDispatch } from "react-redux";

import { resetChatsList } from "../features/chatsListSlice";
import { resetCurrentChatUser } from "../features/currentChatUserSlice";

import { IoAddCircle } from 'react-icons/io5'
import { AiFillWechat } from "react-icons/ai"
import { RiSettings3Fill } from "react-icons/ri"
import { BiLogOut } from "react-icons/bi"

import { IconContext } from "react-icons/lib/esm/iconContext";


const MenuSideBar = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = (e: React.MouseEvent<HTMLElement>): void => {
        e.preventDefault();
        axios.get('http://localhost:8000/api/user/logout', { withCredentials: true })
            .then( (res) => {
                dispatch(resetChatsList());
                dispatch(resetCurrentChatUser()); 
                navigate("/") 
            })
            .catch( (err) => { console.log(err) })
    } 

    return (
        <IconContext.Provider value={{size: "80%", color: "#06A382"}}>
            <div className={styles.container}>
                <ul>
                    <li className={styles.icon_background} onClick={ () => navigate("/home/chats") } ><AiFillWechat/></li>
                    <li className={styles.icon_background} onClick={ () => navigate("/home/search") } ><IoAddCircle/></li>
                    <li className={styles.icon_background} onClick={ () => navigate("/home/settings") } ><RiSettings3Fill/></li>
                    <li className={styles.icon_background} onClick={handleLogout}><BiLogOut/></li>
                </ul>
            </div>
        </IconContext.Provider>
    )

}

export default MenuSideBar;