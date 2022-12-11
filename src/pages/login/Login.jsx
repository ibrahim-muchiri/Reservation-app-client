import "./login.css";
import React from 'react'
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const [credentials, setCredenials] = useState({
        username: undefined,
        password: undefined,
    });

    const { loading, error, dispatch} = useContext(AuthContext);

    const navigate = useNavigate()

    const handleChange = (e) => {
        setCredenials((prev) => ({ ...prev, [e.target.id]: e.target.value}))
    }
    const handleClick = async(e) =>{
        e.preventDefault()
        dispatch({type:"LOGIN_START"});
        try{
            const res = await axios.post("/auth/login", credentials);
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details});
            navigate("/");
        }catch(err){
            dispatch({type:"LOGIN_FAILURE", payload:err.response.data});
        }
    };
    

  return <div className="login">
    <div className="lContainer">
        <input type="text" placeholder="username" id="username" onChange={handleChange} className="lInput" />
        <input type="password" placeholder="password" id="password" onChange={handleChange} className="lInput" />
        <button disabled={loading} onClick={handleClick} className="lButton">Login</button>
        {error && <h2>{error.message}</h2>}
       
    </div>
  </div>
  
}

export default Login