
import React, { useState, useEffect } from "react";
import styles from "./styles/SettingsSidebar.module.css"

import axios from "axios";

import userPic from "../static/User.png"

import { useDispatch } from "react-redux";

import { setSignedInUserUsername } from "../features/signedInUserSlice"


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

    const [errors, setErrors] = useState<{[key: string]: any}>({});
    
    const { username, firstName, lastName, email } = userData;

    const dispatch = useDispatch();

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
                dispatch(setSignedInUserUsername(res.data.username))
            })
            .catch( (error) => {
                setErrors(error.response.data)
            })
    }

    return (
        <div className={styles.container}>
            <img src={userPic} alt="" className={styles.fakeImg}/>
            <h3>Username:</h3>
            {
                errors.hasOwnProperty("username") ?
                <span>{errors.username.message}</span> :
                <i></i>
            }
            <input name="username" className={styles.infoInput} type="text" value={username} onChange={onChange}/>
            <h3>First Name:</h3>
            {
                errors.hasOwnProperty("firstName") ?
                <span>{errors.firstName.message}</span> :
                <i></i>
            }
            <input name="firstName" className={styles.infoInput} type="text" value={firstName} onChange={onChange}/>
            <h3>Last Name:</h3>
            {
                errors.hasOwnProperty("lastName") ?
                <span>{errors.lastName.message}</span> :
                <i></i>
            }
            <input name="lastName"className={styles.infoInput} type="text" value={lastName} onChange={onChange}/>
            <h3>Email:</h3>
            {
                errors.hasOwnProperty("email") ?
                <span>{errors.email.message}</span> :
                <i></i>
            }
            <input name="email" className={styles.infoInput} type="text" value={email} onChange={onChange}/>
            <button onClick={updateUser}>Update</button>
        </div>
    )
}

export default SettingsSidebar;