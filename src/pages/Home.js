import React from 'react';
import { v4 as uuid } from 'uuid';
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const navigate = useNavigate();

    const [roomId, setRoomId] = useState('');
    const [userName, setUserName] = useState('');

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuid();
        setRoomId(id);
        toast.success('Created a new room');

    }
    const joinRoom = () => {
        if (!roomId || !userName) {
            toast.error('RoomId & username is required');
            return;
        }

        // redirect 
        navigate(`/editor/${roomId}`, {
            state: { //using state we can pass data from one route to another
                userName,
            },
        })
    };

    const handleKeyPress = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    }


    return (
        <div className="homePageWrapper">
            <div className="formwrapper">
                <img src="/logoo.png" alt="logo" className="homePageLogo" />

                <h4 className="mainLabel">Paste invitation room ID</h4>
                <div className="inputGroup">
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="ROOM ID"
                        onChange={(e) => setRoomId(e.target.value)}
                        value={roomId}
                        onKeyUp={handleKeyPress}
                    />
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="USERNAME"
                        onChange={(e) => setUserName(e.target.value)}
                        value={userName}
                        onKeyUp={handleKeyPress}
                    />
                    <button onClick={joinRoom} className="btn joinBtn">Join</button>
                    <span className="createInfo">
                        If you dont have an invite then create &nbsp;
                        <a onClick={createNewRoom} href="" className="createNewBtn">new room</a>
                    </span>
                </div>
            </div>

            <footer>
                <h4>Developed&nbsp;by &nbsp;<a href="https://github.com/Ashim-das123">Ashim</a></h4>
            </footer>
        </div>
    )
}
export default Home;