const socket = require("socket.io");
const http = require("http");
const fs = require("fs");
const path = require("path");
const colors = require("colors");

const server = http.createServer((req, res) => {
  let indexPath = path.join(__dirname, "./index.html");
  if (req.url === "/style.css") indexPath = path.join(__dirname, "style.css");
  const readStream = fs.createReadStream(indexPath);

  readStream.pipe(res);
});

const io = socket(server);
const users = ["Alex", "Dmitriy", "Ilya", "Vasya", "Sergey"];
let chatUsers = [];
let chatMessages = [];

const getUser = () => {
  const index = Math.floor(Math.random() * users.length);

  return users[index];
};

io.on("connection", (client) => {
  const name = getUser();
  chatUsers.push(name);
  console.log(`${name} connected`);

  client.broadcast.emit('new_user', chatUsers);
  client.emit('new_user', chatUsers);

  client.broadcast.emit("message", chatMessages);
  client.emit("message", chatMessages);

  client.on("add_message", (msg) => {
    chatMessages.push({name, msg: msg.text});
    client.broadcast.emit("message", chatMessages);
    client.emit("message", chatMessages);
  })

  client.on('reconnect_user', () => {
    console.log(colors.yellow(`${name} reconnecting!`));
    client.broadcast.emit('re_user', chatUsers);
  });

  client.on('disconnect', () => {
    chatUsers = chatUsers.filter((item) => item !== name);
    client.broadcast.emit('out_user', chatUsers);
    client.emit('out_user', chatUsers);
    console.log(colors.red(`${name} disconnect!`));
  });
});

server.listen(5555);
