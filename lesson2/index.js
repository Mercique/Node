const colors = require("colors");

const EventEmitter = require("events");
const emitter = new EventEmitter();

const [date, time] = process.argv.slice(2);
const [day, month, year, hours, minutes, seconds] = [
  ...date.split("."),
  ...time.split(":"),
];
const setDate = new Date(year, month - 1, day, hours, minutes, seconds);

const getDiffDate = (set, cur) => {
  const diff = Math.floor((set - cur) / 1000);

  if (diff == 0) {
    return {
      type: "end",
      text: "Таймер закончился!",
    };
  }
  if (diff < 0) {
    return {
      type: "error",
      text: "Ошибка! Время уже прошло!",
    };
  }
  if (isNaN(diff)) {
    return {
      type: "nan",
      text: "Ошибка ввода! Введите по образцу: `DD-MM-YYYY HH:MM:SS`",
    };
  }

  const seconds = Math.floor(diff % 60);
  const minutes = Math.floor(Math.floor(diff / 60) % 60);
  const hours = Math.floor(Math.floor(diff / 60 / 60) % 24);
  const days = Math.floor(diff / 60 / 60 / 24);

  return {
    type: "timer",
    text: `${days} дней, ${hours} часов, ${minutes} минут, ${seconds} секунд!`,
  };
};

const runTimer = async () => {
  const curDate = new Date();
  const { type, text } = getDiffDate(setDate, curDate);
  let timer;

  emitter.emit(type, text);

  if (type !== "timer") {
    return clearTimeout(timer);
  }

  await new Promise((resolve) => (timer = setTimeout(resolve, 1000)));
  await runTimer();
};

class Handler {
  static timer(payload) {
    console.log(colors.yellow(`Осталось: ${payload}`));
  }
  static end(payload) {
    console.log(colors.green(payload));
  }
  static error(payload) {
    console.log(colors.red(payload));
  }
  static nan(payload) {
    console.log(colors.red(payload));
  }
}

emitter.on("timer", Handler.timer);
emitter.on("end", Handler.end);
emitter.on("error", Handler.error);
emitter.on("nan", Handler.nan);

runTimer();
