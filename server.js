const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = 3000;

server.listen(port, () => {
    console.log(`running on http://localhost:${port}`);
});

app.use(express.static("public"));

app.get("/", (request, response) => {
    response.render(__dirname + "/public/index.html");
});

let messageLog = [];
let connecteds = 0;

io.on("connection", socket => {
    console.log(`${++connecteds} connected`);

    socket.emit("previousMessages", messageLog);

    socket.on("newMessage", data => {
        messageLog.push(data);
        socket.broadcast.emit("newMessage", data);
    });

    socket.on("disconnect", () => {
        console.log(`${--connecteds} connected`);
    });
});
