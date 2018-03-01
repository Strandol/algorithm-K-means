let _ = require("lodash");

function calcMetric(x, y) {
  x = _.split(x, "");
  y = _.split(y, "");

  let i = -1;

  return _.sumBy(x, xVal => {
    i++;
    return Math.abs(xVal - y[i]);
  });
}

function calcCenter(cluster, length) {
  let copy = _.slice(cluster, 0);
  let i = 0;

  return _.reduce(
    new Array(length),
    result => {
      let props = _.map(copy, num => num[i]);
      let median = calcMedian(props).toString();
      i++;
      return result + median;
    },
    ""
  );
}

function getCloserCenter(num, centers) {
  return _.minBy(centers, ({ center }) => calcMetric(num, center));
}

function isCentersEqual(oldCenters, newCenters) {
  newCenters = _.map(_.slice(newCenters, 0), ({ center }) => center);
  oldCenters = _.map(_.slice(oldCenters, 0), ({ center }) => center);
  return _.isEqual(oldCenters, newCenters);
}

function calcMedian(arr) {
  var half = Math.floor(arr.length / 2);

  let copy = _.slice(arr, 0).sort();

  if (arr.length % 2) {
    return arr[half];
  } else {
    return _.ceil((_.toNumber(arr[half - 1]) + _.toNumber(arr[half])) / 2);
  }
}

function getRandomNum(length) {
  return _.random(0, length - 1);
}

module.exports = {
  calcCenter,
  isCentersEqual,
  getCloserCenter,
  getRandomNum
}
