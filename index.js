const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["POST, GET"]
    }
});
app.use(cors());
const PORT = process.env.PORT || 5000;


io.on("connection", (socket) => {
    // console.log("reached to the server");
    socket.emit("me", socket.id);

    socket.on("calluser", ({userToCall, signalData, from, name}) => {
        io.to(userToCall).emit("incomingCall", {signal: signalData, from, name});
    });

    socket.on("answercall", (data) => {
        io.to(data.to).emit("callaccepted", data.signal);
    });

    socket.on("user-left", ({id}) => {
        io.to(id).emit("user-left");
    });

    socket.on("check-call", ({id}) => {
        io.to(id).emit("checked-call");
    });

    socket.on("disconnect", () => {
        socket.broadcast.emit("callended");
    });
});

app.get("/", (req, res, next) => {
    res.send("welcome to the web app");
});


server.listen(PORT , () => {
    console.log(`server is running on port ${PORT}`);
});