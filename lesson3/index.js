const fs = require("fs");

const findIP = ["89.123.1.41", "34.48.240.111"];

const readStreamLogs = fs.createReadStream("./access.log", "utf-8");

const writeStreamLogs = findIP.map((IP) => {
  return fs.createWriteStream(IP + "_requests.log", {
    flags: "a",
    encoding: "utf8",
  });
});

readStreamLogs.on("data", (data) => {
  for (let i = 0; i < findIP.length; i++) {
    const regExp = new RegExp(`${findIP[i]}.*\n`, "g");
    const string = data.match(regExp).join("");
    writeStreamLogs[i].write(string);
  }
});
