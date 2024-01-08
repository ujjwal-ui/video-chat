import classes from "./VideoPlayer.module.css";
import { useContext } from "react";
import {SocketContext} from "../../SocketContext";

const VideoPlayer = () => {
    const {myVideo, remoteVideo, callEnded, remoteStream} = useContext(SocketContext);

    return (
        <div className={classes.videoPlayerContainer}>
            <video ref={myVideo} className={classes.myVideo} autoPlay muted playsInline /> 
           { !callEnded &&  remoteStream && <video ref={remoteVideo} className={classes.remoteVideo} autoPlay playsInline /> }  
        </div>
        
    );
}
export default VideoPlayer;