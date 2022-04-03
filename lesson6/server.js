const socket = require("socket.io");
const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  const indexPath = path.join(__dirname, "./index.html");
  const readStream = fs.createReadStream(indexPath);

  readStream.pipe(res);
});

const io = socket(server);

io.on("connection", (client) => {
  console.log("Connected");

  client.on("client-msg", (data) => {
    console.log(data);

    const payload = {
      message: data.message.split("").reverse().join(""),
    };

    client.broadcast.emit("server-message", payload);
    client.emit("server-message", payload);
  });
});

server.listen(5555);
