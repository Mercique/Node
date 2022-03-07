const colors = require("colors");

const [num1, num2] = process.argv.slice(2);

const isPrime = (num) => {
  let i = 2;
  while (i <= num / 2) {
    if (num % i == 0) {
      return false;
    }
    i++;
  }
  return true;
};

const getPrimes = () => {
  let x = +num1;
  let count = 0;

  while (x <= +num2) {
    if (isPrime(x) && x >= 2) {
      count++;
      switch (count) {
        case 1:
          console.log(colors.green(x));
          break;
        case 2:
          console.log(colors.yellow(x));
          break;
        case 3:
          console.log(colors.red(x));
          break;
      }
      if (count == 3) count = 0;
    }
    x++;
  }
};

const checkInputPrimes = () => {
  if (isNaN(num1) || isNaN(num2)) {
    console.log(colors.red("ERROR! nums is not a numbers!"));
  } else if (+num1 < 0) {
    console.log(colors.red("ERROR! num1 < 0!"));
  } else if (+num1 > +num2) {
    console.log(colors.red("ERROR! num1 > num2!"));
  } else { 
    getPrimes();
  }
}

checkInputPrimes();
