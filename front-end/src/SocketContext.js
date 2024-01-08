
import react, {useRef, useEffect, useState} from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
const socketInstance = io("http://localhost:5000");

const SocketContext = react.createContext();


const SocketContextProvider = ({children}) => {
    const [stream, setStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const myVideo = useRef();
    const remoteVideo = useRef();
    const [me, setMe] = useState("");
    const [incommingCall, setIncommingCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [error, setError] = useState("");
    const peerConnectionRef = useRef();

    useEffect(() => {

        navigator.mediaDevices.getUserMedia({audio: true, video: true})
        .then(stream => {
            setStream(stream);
            if(myVideo.current) {
                myVideo.current.srcObject = stream;
            }
        })                      
        .catch(error => {
            console.log(error);
        });

        socketInstance.on("me", id => setMe(id));

        socketInstance.on("incomingCall", (data) => {
            setIncommingCall(data);
        });

        socketInstance.on("user-left", () => {
            console.log("user-left..");
            setCallEnded(true);
        });

    }, []);


    const callUser = (id) => {
        const peer = new Peer({initiator: true, trickle: false, stream: stream});
        peer.on("signal", signal => {
            socketInstance.emit("calluser", {userToCall: id, signalData: signal, from: me, name: "ujjwal"});
        });
        peer.on("stream", remoteStream => {
            setRemoteStream(remoteStream);
            remoteVideo.current.srcObject = remoteStream;
            setCallAccepted(true);
        });
        
        socketInstance.on("callaccepted", signal => {
            console.log(signal);
            peer.signal(signal);
        });
        peerConnectionRef.current = peer; 
    }

    const answerCall = () => {
        console.log("answering");
        const peer = new Peer({initiator: false, trickle: false, stream: stream});
        peer.on("signal", signal => {
            socketInstance.emit("answercall", {signal: signal, to: incommingCall.from});
        });
        peer.on("stream", remoteStream => {
            setRemoteStream(remoteStream);
            remoteVideo.current.srcObject = remoteStream;
            setCallAccepted(true);
        });
        peer.signal(incommingCall.signal);
        peerConnectionRef.current = peer;   
    }

    const sendMessage = () => {

    }

    const endCall = () => {
        setCallEnded(true);
        // peerConnectionRef.current.destroy();
        // socketInstance.emit("user-left", {to: incommingCall.from});
        window.location.reload();
    }

    return(
        <SocketContext.Provider value={ {
                                myVideo, callAccepted, error, callEnded,
                                me, remoteVideo, callUser, remoteStream,
                                incommingCall, answerCall, endCall} }>
            {children}
        </SocketContext.Provider>
    );

};
export { SocketContextProvider, SocketContext };
