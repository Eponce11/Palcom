
import React, { useState, useEffect } from "react";
import styles from "./styles/SettingsSidebar.module.css"

import axios from "axios";



interface userInfo {
    username: string,
    firstName: string,
    lastName: string,
    email: string
}


const SettingsSidebar = () => {

    const [userData, setUserData] = useState<userInfo>({
        username: '',
        firstName: '',
        lastName: '',
        email: ''
    })
    
    const { username, firstName, lastName, email } = userData;

    useEffect( () => {
        axios.get('http://localhost:8000/api/user/getUserInfo', { withCredentials: true })
            .then( (res) => {
                setUserData(res.data)
            })
            .catch( (error) => console.log(error) ) 
    }, [])


    const onChange = (e:React.ChangeEvent<HTMLInputElement>): void => {
        e.preventDefault();
        setUserData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const updateUser = () => {

        
        axios.put('http://localhost:8000/api/user/update', userData, { withCredentials: true })
            .then( (res) => {
                console.log(res.data)
            })
            .catch( (error) => {
                console.log(error.response.data)
            })
    }

    return (
        <div className={styles.container}>
            <div className={styles.fakeImg}></div>
            <h3>Username:</h3>
            <input name="username" className={styles.infoInput} type="text" value={username} onChange={onChange}/>
            <h3>First Name:</h3>
            <input name="firstName" className={styles.infoInput} type="text" value={firstName} onChange={onChange}/>
            <h3>Last Name:</h3>
            <input name="lastName"className={styles.infoInput} type="text" value={lastName} onChange={onChange}/>
            <h3>Email:</h3>
            <input name="email" className={styles.infoInput} type="text" value={email} onChange={onChange}/>
            <button onClick={updateUser}>Update</button>
        </div>
    )
}

export default SettingsSidebar;