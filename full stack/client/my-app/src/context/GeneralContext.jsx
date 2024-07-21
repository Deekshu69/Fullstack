import React, { createContext, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const GeneralContext = createContext();

const GeneralContextProvider = ({children}) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = async () => {
        try {
            const loginInputs = {email, password}
            const res = await axios.post('http://localhost:6001/login', loginInputs);
            localStorage.setItem('userId', res.data._id);
            localStorage.setItem('username', res.data.username);
            localStorage.setItem('email', res.data.email);
            navigate('/');
        } catch (err) {
            console.error("Login failed:", err.response ? err.response.data : err.message);
            throw new Error(err.response ? err.response.data.message : "Login failed");
        }
    }

    const register = async () => {
        try {
            const registerInputs = {
                username, 
                email, 
                password,
                usertype: 'default', // Default value
                domain: 'default',   // Default value
                qualification: 'default' // Default value
            };
            const res = await axios.post('http://localhost:6001/register', registerInputs);
            localStorage.setItem('userId', res.data._id);
            localStorage.setItem('username', res.data.username);
            localStorage.setItem('email', res.data.email);
            navigate('/');
        } catch (err) {
            console.error("Registration failed:", err.response ? err.response.data : err.message);
            throw new Error(err.response ? err.response.data.message : "Registration failed");
        }
    }

    const logout = () => {
        localStorage.clear();
        navigate('/');
    }

    return (
        <GeneralContext.Provider value={{
            login,
            register,
            logout,
            username,
            setUsername,
            email,
            setEmail,
            password,
            setPassword
        }}>
            {children}
        </GeneralContext.Provider>
    )
}

export default GeneralContextProvider;