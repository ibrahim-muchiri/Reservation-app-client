import "./reserve.css"
import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import useFetch from "../../hooks/useFetch"
import { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SearchContext} from './../../context/SearchContext'
import axios from "axios";


function Reserve({setOpen, hotelId}) {
    const [selectedRooms, setSelectRooms] = useState([]);
    const { data, loading, error } = useFetch(`/hotel/room/${hotelId}`);
    const {dates} = useContext(SearchContext);

    

    const getDateInRange = (startDate, endDate) =>{
        const start = new Date(startDate);
        const end = new Date(endDate)
        const date = new Date(start.getTime());

        let list = [] 

        while(data <= end){
            list.push(new Date(date).getTime())
            date.setDate(date.getDate() +1)
        }
        return list
    };
    

    const handleSelect =(e)=>{
        const checked = e.target.checked;
        const value = e.target.value;
        setSelectRooms(checked ? [...selectedRooms, value] : selectedRooms.filter((item)=> item !== value))
    }
    const navigate = useNavigate();

    const handleClick = async() =>{
        try{
            await Promise.all(selectedRooms.map((roomId) => {
                const res = axios.put(`/room/availability/${roomId}`);
                return res.data;
                
            }))
            setOpen(false);
            navigate("/");
        }catch(err){

        }
    }

    console.log(getDateInRange());

    // const alldates = getDateInRange(dates[0].startDate, dates[0].endDate);

    // const isAvailable = ( roomNumber ) =>{
    //     const isFound = roomNumber.unavailableDates.some(date=>
    //         alldates.includes(new Date(date).getTime())
    //     );
    //     return !isFound
    // }
  return (
    <div className="reserve">
        <div className="rContainer">
            <FontAwesomeIcon
            icon={faCircleXmark}
            className="rClose"
            onClick={() => setOpen(false)}
            />
            <span>Select your rooms:</span>
            {data.map(item=>(
                <div className="rItem">
                    <div className="rItemInfo">
                        <div className="rTitle"><b>{item.title}</b></div>
                        <div className="rDesc"><b>{item.Desc}</b></div>
                        <div className="rMax"><b>{item.maxPeople}</b></div>
                        <div className="rPrice"><b>{item.price}</b></div>
                        {item.roomNumbers.map((roomNumber)=>(
                            <div className="room">
                                <label>{roomNumber.number}</label>
                                <input type="checkbox" value={roomNumber._id} onChange={handleSelect}
                                // disabled={!isAvailable(roomNumber)} 
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <button onClick={handleClick} className="rButton">Reserve Now</button>
        </div>
    </div>
  )
}

export default Reserve