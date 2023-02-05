
import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

import styles from './styles/LoginPage.module.css';

import { useDispatch } from "react-redux";
import { setSignedInUser } from "../features/signedInUserSlice";
import type { signedInUserState } from "../features/signedInUserSlice";

const LoginPage = () => {

    // object for the user login info
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const [error, setError] = useState<string>("")
    
    const { email, password } = formData;


    const navigate = useNavigate();

    const dispatch = useDispatch();
    

    const onChange = (e:React.ChangeEvent<HTMLInputElement>): void => {
        e.preventDefault();
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const handleLogin = async(e:React.MouseEvent<HTMLElement>): Promise<any> => {
        e.preventDefault();
        axios.post('http://localhost:8000/api/user/login', formData)
            .then( (res) => {
                const signedInUser:signedInUserState = { 
                    id: res.data.id, 
                    username: res.data.username 
                }
                dispatch(setSignedInUser(signedInUser))
                navigate("/home/chats")
            })
            .catch( (error) =>  setError(error.response.data.error));
    }


    return(
        <div className={styles.box}>
            <div className={styles.form}>
                <h2>Sign in</h2>
                <span>{ error }</span>
                <div className={styles.inputBox}>
                    <input type="text" name='email' value={email} onChange={onChange} required/>
                    <span>Email</span>
                    <i></i>
                </div>
                <div className={styles.inputBox}>
                    <input type="password" name='password' value={password} onChange={onChange} required/>
                    <span>Password</span>
                    <i></i>
                </div>
                <div className={styles.links}>
                    <Link to="/register">Signup</Link>
                </div>
                <input type="submit" value="Login" onClick={handleLogin}/>
            </div>
        </div>
    )
}


export default LoginPage;