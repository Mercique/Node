#!/home/mercique/.nvm/versions/node/v17.3.0/bin/node
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const inquirer = require("inquirer");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

const main = async () => {
  const filePath = await question("Введите путь до файла: ");
  const checkPath = filePath === "" ? "./" : filePath;
  const fileList = fs.readdirSync(checkPath);
  showFiles(fileList, checkPath);
};

const checkFiles = (path) => {
  if (fs.lstatSync(path).isFile()) return true;
  return false;
};

const showFiles = (fileList, checkPath) => {
  inquirer
    .prompt([
      {
        name: "fileName",
        type: "list",
        message: "Выберите файл:",
        choices: fileList,
      },
    ])
    .then(({ fileName }) => {
      const fullPath = path.join(checkPath, fileName);

      if (checkFiles(fullPath)) {
        const data = fs.readFileSync(fullPath, "utf-8");
        console.log(data);
      } else {
        const directoryList = fs.readdirSync(fullPath);
        showFiles(directoryList, fullPath);
      }
    });
};

main();