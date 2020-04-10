(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const normalizePeriod = (period, timeToElapse) => {
  let nbreDays = null;

  switch (period) {
    case 'days':
      nbreDays = timeToElapse;
      break;

    case 'weeks':
      nbreDays = 7 * timeToElapse;
      break;

    case 'months':
      nbreDays = 30 * timeToElapse;
      break;

    default:
      break;
  }

  return nbreDays;
};

const covid19ImpactEstimator = data => {
  /** Normaliezd request time */
  const time = normalizePeriod(data.periodType, data.timeToElapse);
  /** Impact computation */

  const impactCurrentlyInfected = data.reportedCases * 10;
  const impactInfectionsByRequestedTime = impactCurrentlyInfected * 2 ** Math.floor(time / 3);
  const impactSevereCasesByRequestedTime = Math.ceil(impactInfectionsByRequestedTime * 0.15);
  const impactHospitalBedsByRequestedTime = Math.ceil(data.totalHospitalBeds * 0.35) - impactSevereCasesByRequestedTime;
  const impactCasesForICUByRequestedTime = Math.floor(impactInfectionsByRequestedTime * 0.05);
  const impactCasesForVentilatorsByRequestedTime = Math.floor(impactInfectionsByRequestedTime * 0.02);
  const impactDollarsInFlight = impactInfectionsByRequestedTime * data.region.avgDailyIncomePopulation * data.region.avgDailyIncomeInUSD / time;
  const impact = {
    currentlyInfected: impactCurrentlyInfected,
    infectionsByRequestedTime: impactInfectionsByRequestedTime,
    severeCasesByRequestedTime: impactSevereCasesByRequestedTime,
    hospitalBedsByRequestedTime: impactHospitalBedsByRequestedTime,
    casesForICUByRequestedTime: impactCasesForICUByRequestedTime,
    casesForVentilatorsByRequestedTime: impactCasesForVentilatorsByRequestedTime,
    dollarsInFlight: Math.trunc(impactDollarsInFlight)
  };
  /** Severe Impact computation */

  const severeimpactCurrentlyInfected = data.reportedCases * 50;
  const severeimpactInfectionsByRequestedTime = severeimpactCurrentlyInfected * 2 ** Math.floor(time / 3);
  const severeimpactSevereCasesByRequestedTime = Math.ceil(severeimpactInfectionsByRequestedTime * 0.15);
  const severeImpactHospitalBedsByRequestedTime = Math.ceil(data.totalHospitalBeds * 0.35) - severeimpactSevereCasesByRequestedTime;
  const severeimpactCasesForICUByRequestedTime = Math.floor(severeimpactInfectionsByRequestedTime * 0.05);
  const severeimpactCasesForVentilatorsByRequestedTime = Math.floor(severeimpactInfectionsByRequestedTime * 0.02);
  const severeimpactDollarsInFlight = severeimpactInfectionsByRequestedTime * data.region.avgDailyIncomePopulation * data.region.avgDailyIncomeInUSD / time;
  const severeImpact = {
    currentlyInfected: severeimpactCurrentlyInfected,
    infectionsByRequestedTime: severeimpactInfectionsByRequestedTime,
    severeCasesByRequestedTime: severeimpactSevereCasesByRequestedTime,
    hospitalBedsByRequestedTime: severeImpactHospitalBedsByRequestedTime,
    casesForICUByRequestedTime: severeimpactCasesForICUByRequestedTime,
    casesForVentilatorsByRequestedTime: severeimpactCasesForVentilatorsByRequestedTime,
    dollarsInFlight: Math.trunc(severeimpactDollarsInFlight)
  };
  /** Object returned */

  return {
    data,
    impact,
    severeImpact
  };
};

var _default = covid19ImpactEstimator;
exports.default = _default;

},{}],2:[function(require,module,exports){
"use strict";

var _estimator = _interopRequireDefault(require("./estimator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener('click', () => {
  const population = Number(document.getElementById('population').value);
  const timeToElapse = Number(document.getElementById('timeToElapse').value);
  const reportedCases = Number(document.getElementById('reportedCases').value);
  const totalHospitalBeds = Number(document.getElementById('totalHospitalBeds').value);
  const periodType = document.getElementById('periodType').value;
  const result = (0, _estimator.default)({
    population,
    timeToElapse,
    reportedCases,
    totalHospitalBeds,
    periodType,
    region: {
      name: 'Africa',
      avgAge: 19.7,
      avgDailyIncomeInUSD: 4,
      avgDailyIncomePopulation: 0.73
    }
  });
  console.log(result); // console.log({ population, timeToElapse, reportedCases, totalHospitalBeds, periodType });
});

},{"./estimator":1}]},{},[1,2]);
