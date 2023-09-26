import React, { useState, useRef, useEffect } from 'react'
import Client from '../components/Client'
import Editor from '../components/Editor'
import { initSocket } from '../socket';
import ACTIONS from '../Action';

import toast from 'react-hot-toast';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';

const EditorPage = () => {
    const socketRef = useRef(null);// data chnage holeojate rerender na hoy

    const codeRef = useRef(null);

    const reactNavigator = useNavigate();
    const location = useLocation();
    const { roomId } = useParams();

    const [clients, setClients] = useState([

    ])




    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();

            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.')
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                userName: location.state?.userName,
            });

            // Listening for joined event

            socketRef.current.on(ACTIONS.JOINED, ({ clients, userName, socketId }) => {

                if (userName != location.state?.userName) {
                    toast.success(`${userName} joined the room`);
                    console.log(`${userName} joined`)
                }
                setClients(clients)

                socketRef.current.emit(ACTIONS.SYNC_CODE, {
                    code: codeRef.current,
                    socketId,
                })
            });
            //  listening for disconnected
            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, userName }) => {
                toast.success(`${userName} left the room`);
                setClients((prev) => {
                    return prev.filter(client => client.socketId !== socketId)
                })
            })

        }
        init();

        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        }

    }, []);

    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(roomId)
            toast.success('Room Id copied')
        }
        catch (err) {
            toast.error('Could not copy the Room Id')
            console.log(err);
        }
    }
    function leaveRoom() {
        reactNavigator('/')
    }



    if (!location.state) {
        return <Navigate to="/" />
    }

    return (
        <div className='mainWrapper'>
            <div className='leftside'>
                <div className='leftsideInner'>
                    <div className='logo'>
                        <img className='logoimg' src="/logo1.png" alt="logo2" />
                    </div>
                    <h3>Connected</h3>
                    <div className='clientLists'>
                        {
                            clients.map((client) => (
                                <Client key={client.socketId}
                                    userName={client.userName}
                                />
                            ))
                        }
                    </div>
                </div>
                <button className='btn copyBtn' onClick={copyRoomId}>Copy ROOM ID</button>
                <button className='btn leaveBtn' onClick={leaveRoom}>Leave</button>
            </div>
            <div className='rightsideEditor'>
                <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => { codeRef.current = code }} />
            </div>

        </div>

    )
}

export default EditorPage