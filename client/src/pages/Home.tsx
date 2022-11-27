import React, { useState } from "react";


import MenuSideBar from "../components/MenuSideBar";
import ChatSideBar from "../components/ChatSideBar";
import SettingsSidebar from "../components/SettingsSidebar";
import SearchSideBar from "../components/SearchSideBar";

import styles from './styles/Home.module.css';
import axios from "axios";

import { RootState } from "../app/store";
import { useSelector } from "react-redux";

const Home = () => {

    axios.defaults.withCredentials = true;
    
    const [message, setMessage] = useState<string>('');
    const currentChatUser = useSelector((state:RootState) => state.currentChatUser)
    const signedInUser = useSelector((state:RootState) => state.signedInUser)

    /*
    const [socket] = useState(() => io(':8000'))

    
    useEffect(() => {

        socket.on("connect", () => {
            console.log(socket.id)
        })  
    

    },[])
    */


    const sendMessage = () => {

        const data: object = {
            message: message,
            to: currentChatUser.id
        }

        axios.post("http://localhost:8000/api/message/create", data, { withCredentials: true })
            .then( (res) => {
                console.log(res.data)
                setMessage('');
            })
            .catch( (err) => console.log(err))
        
    }



    return(
        <div className={styles.container}>

            <div className={styles.header}>
                <h3>PalCom</h3>
            </div>

            <div className={styles.body}>

                <MenuSideBar/>

                <div className={styles.sideBar}>
                    <div className={styles.sideBarHeader}>
                        
                    </div>

                    <SettingsSidebar/>

                    <div className={styles.userInfo}>
                        <div className={styles.fakeImg}></div>
                        <h3>{signedInUser.username}</h3>
                    </div>
                </div>



                <div className={styles.messageTab}>
                    <div className={styles.messageTabHeader}>
                        <div className={styles.fakeImg}></div>
                        <h2>{currentChatUser.username}</h2>
                    </div>
                    <div className={styles.messageReceive}>
                        {
                            currentChatUser.messages.map( (message, idx) => {        
                                return (
                                    <div key={idx}>
                                        { 
                                            message.fromSelf ?
                                            <p className={styles.myMessage} key={idx}>{message.text}</p> :
                                            <p className={styles.othersMessage} key={idx}>{message.text}</p>
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className={styles.messageInput}>
                        <input type="text" placeholder="Message User" value={message} onChange={ (e) => setMessage(e.target.value)} />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>

                
            </div>
        </div>
    )
}


export default Home;