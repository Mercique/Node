const http = require("http");
const path = require("path");
const fs = require("fs");

const isFile = (path) => fs.lstatSync(path).isFile();

const server = http.createServer((req, res) => {
  const fullPath = path.join(process.cwd(), req.url);

  if (!fs.existsSync(fullPath)) return res.end("ERROR! File not found!");

  if (isFile(fullPath)) return fs.createReadStream(fullPath).pipe(res);

  let pathLinks = "";
  fs.readdirSync(fullPath).forEach((fileName) => {
    const filePath = path.join(req.url, fileName);
    pathLinks += `<li><a href="${filePath}">${fileName}</a></li>`;
  });

  const html = path.join(__dirname, "index.html");
  const htmlText = fs.readFileSync(html, "utf-8").replace("path", pathLinks);

  res.writeHead(200, {
    "Content-Type": "text/html",
  });
  res.end(htmlText);
});

server.listen(5050);
