import { useState, useEffect  } from "react";
import { Outlet } from "react-router-dom";

import MenuSideBar from "../components/MenuSideBar";

import userPic from "../static/User.png"

import styles from './styles/Home.module.css';
import axios from "axios";

import { RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { addCurrentChatMessage } from "../features/currentChatUserSlice";

import { io } from "socket.io-client";


interface sentMessage {
    message: string,
    to: string,
    from: string
}


const Home = () => {

    axios.defaults.withCredentials = true;
    
    const [message, setMessage] = useState<string>('');
    const currentChatUser = useSelector((state:RootState) => state.currentChatUser)
    const signedInUser = useSelector((state:RootState) => state.signedInUser)

    
    const [socket] = useState(() => io(':8000'))

    const dispatch = useDispatch();
    
    useEffect(() => {
        socket.on("connect", () => {
            socket.emit("add-user", signedInUser.id);
        })  
    
    },[socket, signedInUser])

    useEffect(() => {
        if (socket) {
            socket.on("msg-receive", (msg) => {
                dispatch(addCurrentChatMessage({
                    fromSelf: false,
                    text: msg
                }))
            })
        }
    },[socket, dispatch])
    


    const sendMessage = () => {


        const data: sentMessage = {
            message: message,
            to: currentChatUser.id,
            from: signedInUser.id
        }

        axios.post("http://localhost:8000/api/message/create", data, { withCredentials: true })
            .then( (res) => {
                console.log(res.data)
                socket.emit("send-msg", data);
                dispatch(addCurrentChatMessage({
                    fromSelf: true,
                    text: data.message
                }))
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
                    


                    <Outlet />

                    <div className={styles.userInfo}>
                        <img src={userPic} alt="" className={styles.fakeImg}/>
                        <h3>{signedInUser.username}</h3>
                    </div>
                </div>



                <div className={styles.messageTab}>
                    <div className={styles.messageTabHeader}>
                        <img src={userPic} alt="" className={styles.fakeImg}/>
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