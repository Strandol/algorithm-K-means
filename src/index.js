let _ = require("lodash");
let fs = require("fs");

let { getRandomNum, calcCenter, isCentersEqual, getCloserCenter } = require("./utils");

let content = fs
  .readFileSync("./src/exam.txt")
  .toString()
  .split("\r\n");

let teach = fs
  .readFileSync("./src/teach.txt")
  .toString()
  .split("\r\n");

let count = content.length;

const NUM_LENGTH = content[0].length;

let centers = [];
let oldCenters = [];

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

while (!isCentersEqual(oldCenters, centers)) {
  centers = _.map(centers, (center, i) => {
    center.cluster = [];
    return center;
  })

  oldCenters = _.cloneDeep(centers);

  _.forEach(content, num => {
    let rightCenter = getCloserCenter(num, centers);
    rightCenter.cluster.push(num);
  });

  _.forEach(centers, (obj, i) => {
    let { center, cluster } = obj;

    centers[i].center = calcCenter(cluster, NUM_LENGTH);
  });
}

centers = _.map(centers, obj => {
  obj.cluster = _.map(obj.cluster, num => {
    let teachNum = _.find(teach, tNum => tNum.includes(num));
    return {
      value: num,
      cluster: _.last(teachNum) 
    }
  })

  return obj;
})
