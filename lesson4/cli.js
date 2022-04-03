#!/home/mercique/.nvm/versions/node/v17.3.0/bin/node
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const inquirer = require("inquirer");
const colors = require("colors");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

(async () => {
  const filePath = await question("Введите путь до файла: ");
  const fileSearchText = await question("Введите искомый текст: ");
  const checkPath = filePath === "" ? "./" : filePath;
  const fileList = fs.readdirSync(checkPath);
  showFiles(fileList, checkPath, fileSearchText);
})();

const isFile = (path) => fs.lstatSync(path).isFile();

const searchText = (file, text) => {
  let count = 0;
  if (file.includes(text) && text.length != 0) {
    const regExp = new RegExp(text, "g");
    console.log(
      file.replace(regExp, () => {
        count++;
        return colors.green(text);
      })
    );
  } else {
    console.log(file);
  }
  console.log(colors.yellow(`Найдено искомых значений в файле: ${count}`));
};

const showFiles = (fileList, checkPath, fileSearchText) => {
  inquirer
    .prompt([
      {
        name: "fileName",
        type: "list",
        message: "Выберите файл/директорию:",
        choices: fileList,
      },
    ])
    .then(({ fileName }) => {
      const fullPath = path.join(checkPath, fileName);
      if (isFile(fullPath)) {
        const data = fs.readFileSync(fullPath, "utf-8");
        searchText(data, fileSearchText);
      } else {
        const directoryList = fs.readdirSync(fullPath);
        showFiles(directoryList, fullPath, fileSearchText);
      }
    });
};
