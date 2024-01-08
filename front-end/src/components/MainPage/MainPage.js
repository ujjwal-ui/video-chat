import VideoPlayer from "../VideoPlayer/VideoPlayer";
import { useState, useEffect, useRef } from "react";
import {useContext} from "react";
import { SocketContext } from "../../SocketContext";
import classes from "./MainPage.module.css";
import NavBar from "../NavBar/NavBar";
import { toast } from "react-toastify";


const MainPage = () => {
    const [error, setError] = useState(false);
    const {me, callUser, incommingCall, answerCall, callAccepted, endCall} = useContext(SocketContext);
    const id = useRef();


    const checkError = (value) => {
        if(!value) return true;
        return false;    
    }

    const makeCall = () => {
        if(checkError(id.current.value))
           toast.error("user to call Id is empty");

        callUser(id.current.value);
    }


    return (
        <>
            <div className={classes.mainPage}>
                {incommingCall.signal && !callAccepted && <p>{incommingCall.name} is calling</p>}
                <div className={classes.myVideo}>
                    <VideoPlayer />
                </div>
                <div className={classes.controlers}>
                    <div className={classes.sub}>
                        <div className={classes.inputFields}>
                            <div className={classes.yourId}>
                                <lable>Your Id</lable>
                                <input ref={id} type="text" placeholder="id" defaultValue={me}/>
                            </div>
                             <div className={classes.remoteId}>
                                <lable>User to Call</lable>
                                <input ref={id} type="text" placeholder="id"/>
                            </div>
                        </div>
                        <div className={classes.controlButtons}>
                            <button onClick={makeCall} >Call</button>
                            { incommingCall.signal && !callAccepted && <button onClick={answerCall}>Answer</button> }
                            { callAccepted && <button onClick={endCall}>Hang up</button> }
                         </div>
                    </div>
                </div>
                <h4>Copy your Id and send it to your friend.</h4>
            </div>
        </>
    );
}

export default MainPage;