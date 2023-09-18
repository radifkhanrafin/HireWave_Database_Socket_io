const { Server } = require("socket.io");

const io = new Server({ cors: "http://localhost:5173" });

let onlineUsers = [];

io.on("connection", (socket) => {
    console.log("new collection", socket.id)

    socket.on("addNewUsers", (userId) => {
        !onlineUsers.some(user => user.userId === userId) &&
            onlineUsers.push({
                userId,
                socketId: socket.id
            });
        console.log("onlineUsers", onlineUsers)
 
        io.emit("getOnlineUsers", onlineUsers)
    });

    // add message 
    socket.on("sendMessage", (message) => {
        console.log("message" , message)
        const user = onlineUsers.find((user) => user.userId === message.receiver);
        console.log(onlineUsers)
        console.log("user" ,user)
        if (user) {
            io.to(user.socketId).emit("getMessages", message)
        }
    })

    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
        io.emit("getOnlineUsers", onlineUsers)
    })

});

io.listen(3000);