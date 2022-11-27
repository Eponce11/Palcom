import React, { useState } from "react";
import { Link, useNavigate, Outlet } from 'react-router-dom';
import axios from "axios";

import styles from './styles/RegisterPage.module.css'


interface User {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface Errors {
    username: object;
    firstName: object;
    lastName: object;
    email: object;
    password: object;
    confirmPassword: object;
}

const RegisterPage = () => {

    

    // object for the user login info
    const [formData, setFormData] = useState<User>({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [errors, setErrors] = useState<{[key: string]: any}>({});

    // destructure the formData
    const { username, firstName, lastName, email, password, confirmPassword } = formData;

    // store the useNavigate, allows us to change the route
    const navigate = useNavigate();

    // change the corresponding pair in the formData object when the value is changed on the input fields
    const onChange = (e:React.ChangeEvent<HTMLInputElement>): void => {
        e.preventDefault();
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    // call backend register route passing the formData
    const handleRegister = (e:React.MouseEvent<HTMLElement>): void => {
        e.preventDefault();
        axios.post('http://localhost:8000/api/user/register', formData)
            .then( (res) => {
                console.log(res.data);
                navigate("/home");
            })
            .catch( (error) => {
                console.log(error.response.data)
                error.response.data.hasOwnProperty('error') ?
                    setErrors(error.response.data.error.errors) :
                    setErrors(error.response.data);
            });
    }


    return(
        <div className={styles.box}>
            

            <div className={styles.form}>
                <h2>Register</h2>
                <div className={styles.inputBox}>
                    <input type="text" name='username' value={username} onChange={onChange} required/>
                    { 
                        errors.hasOwnProperty('username') ?
                            <span>Username {errors['username']['message']}</span> :
                            <span>Username</span>
                    }
                    <i></i>
                </div>
                <div className={styles.inputBox}>
                    <input type="text" name='firstName' value={firstName} onChange={onChange} required/>
                    { 
                        errors.hasOwnProperty('firstName') ?
                            <span>FirstName {errors['firstName']['message']}</span> :
                            <span>FirstName</span>
                    }
                    <i></i>
                </div>
                <div className={styles.inputBox}>
                    <input type="text" name='lastName' value={lastName} onChange={onChange} required/>
                    { 
                        errors.hasOwnProperty('lastName') ?
                            <span>LastName {errors['lastName']['message']}</span> :
                            <span>LastName</span>
                    }
                    <i></i>
                </div>
                <div className={styles.inputBox}>
                    <input type="text" name='email' value={email} onChange={onChange}required/>
                    { 
                        errors.hasOwnProperty('email') ?
                            <span>Email {errors['email']['message']}</span> :
                            <span>Email</span>
                    }
                    <i></i>
                </div>
                <div className={styles.inputBox}>
                    <input type="password" name='password' value={password} onChange={onChange} required/>
                    { 
                        errors.hasOwnProperty('password') ?
                            <span>Password {errors['password']['message']}</span> :
                            <span>Password</span>
                    }
                    <i></i>
                </div>
                <div className={styles.inputBox}>
                    <input type="password" name='confirmPassword' value={confirmPassword} onChange={onChange} required/>
                    { 
                        errors.hasOwnProperty('confirmPassword') ?
                            <span>ConfirmPassword {errors['confirmPassword']['message']}</span> :
                            <span>ConfirmPassword</span>
                    }
                    <i></i>
                </div>
                <div className={styles.links}>
                    <Link to="/">Login</Link>
                </div>
                <input type="submit" value="Register" onClick={handleRegister}/>
            </div>
            <Outlet/>
        </div>
    )
}

export default RegisterPage;