
import React, { useState } from 'react';
import styles from './styles/SearchSideBar.module.css'
import axios from 'axios';

const SearchSideBar = () => {

    const [user, setUser] = useState<{[key: string]: any}>({}) 
    const [searchUsername, setSearchUsername] = useState<string>("");
    const [error, setError] = useState<string>("");


    const searchForUser = (e:any) => {
        e.preventDefault()

        axios.post("http://localhost:8000/api/user/findUser", { username: searchUsername }, { withCredentials: true })
            .then( (res) => {
                setError("")
                setUser(res.data)
                console.log(res.data)
            })
            .catch( (error) => {
                setUser({});
                setError(error.response.data.error);
            })


    }

    return (
        <div className={styles.container}>
            <input type="text" placeholder='Search User'  value={searchUsername} onChange={ (e) => { setSearchUsername(e.target.value) }} />
            <button onClick={searchForUser}>Search</button>
            <span>{ error }</span>
            {
                user.hasOwnProperty("id") ?
                    <div className={styles.user}>
                        <div className={styles.fakeImg}></div>
                        <h3>{ user.username }</h3>
                    </div> :
                    <></>
            }
        </div>
        
    )
}


export default SearchSideBar