let _ = require("lodash");
let readline = require("readline");
let fs = require("fs");
const cTable = require("console.table");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let {
  getRandomNum,
  calcCenter,
  isCentersEqual,
  getCloserCenter
} = require("./utils");

const MAX_DEPTH = 1000;
const EXAM_PATH = "./src/docs/exam.txt";
const TEACH_PATH = "./src/docs/teach.txt";

let content = fs
  .readFileSync(EXAM_PATH)
  .toString()
  .split("\r\n");

let teach = fs
  .readFileSync(TEACH_PATH)
  .toString()
  .split("\r\n");

let count = content.length;

const NUM_LENGTH = content[0].length;

let centers = [];
let withRealClass = [];
let oldCenters = [];

let entryMsg = `
    Введите вариант действия:
    1. Вывести на экран все символы и соответствующие им кластеры
    2. Вывести на экран символы определенного кластера
    3. Выйти
    Ответ: `;

function showMenu() {
  rl.question(entryMsg, answer => {
    switch (answer) {
      case "1":
        showAllSymbols(withRealClass);
        break;
      case "2":
        rl.question("Введите номер кластера: ", num => {
          showSpecificCluster(withRealClass, num);
          showMenu();
        });
        return;
      case "3":
        process.exit();
        return;
      default:
        break;
    }

    showMenu();
  });
}

function showAllSymbols(symbols) {
  console.log("\n");
  console.table(symbolsToTable(symbols));
  console.log("====================================");
  console.log("Усредненные символы:\n");
  console.log(
    _.map(symbols, (symb, i) => `${symb.center} ---- cluster №${i}`).join("\n")
  );
  console.log("====================================");
}

function symbolsToTable(symbols) {
  let prepared = _.map(symbols, ({ cluster }, i) =>
    _.map(cluster, symbObj => {
      return {
        symbol: symbObj.value,
        cluster: i,
        realClass: symbObj.class
      };
    })
  );

  return _.flattenDeep(prepared);
}

function showSpecificCluster(symbols, clusterNum) {
  let symbol = symbols[clusterNum];
  console.log("\n");
  console.log(`Усредненный символ: ${symbol.center}\n`);
  console.table(symbolsToTable([symbol]));
}

_.forEach(new Array(4), () => {
  let randomI = getRandomNum(content.length);

  while (_.find(centers, { position: randomI })) {
    randomI = getRandomNum(content.length);
  }

  let center = content[randomI];

  centers.push({
    position: randomI,
    center,
    cluster: []
  });
});

let amount = 0;

while (amount < MAX_DEPTH && !isCentersEqual(oldCenters, centers)) {
  centers = _.map(centers, (center, i) => {
    center.cluster = [];
    return center;
  });

  oldCenters = _.cloneDeep(centers);

  _.forEach(content, num => {
    let rightCenter = getCloserCenter(num, centers);
    rightCenter.cluster.push(num);
  });

  _.forEach(centers, (obj, i) => {
    let { center, cluster } = obj;

    centers[i].center = calcCenter(cluster, NUM_LENGTH);
  });

  amount++;
}

withRealClass = _.map(_.cloneDeep(centers), obj => {
  obj.cluster = _.map(obj.cluster, num => {
    let teachNum = _.find(teach, tNum => tNum.includes(num));
    return {
      value: num,
      class: _.last(teachNum)
    };
  });

  return obj;
});

showMenu();
