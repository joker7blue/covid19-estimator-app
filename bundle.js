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

  return Math.trunc(nbreDays);
};

const covid19ImpactEstimator = data => {
  /** Normaliezd request time */
  const time = normalizePeriod(data.periodType, data.timeToElapse);
  /** Impact computation */

  const impactCurrentlyInfected = Math.trunc(data.reportedCases * 10);
  const impactInfectionsByRequestedTime = Math.trunc(impactCurrentlyInfected * 2 ** Math.trunc(time / 3));
  const impactSevereCasesByRequestedTime = Math.trunc(impactInfectionsByRequestedTime * 0.15);
  const impactHospitalBedsByRequestedTime = Math.trunc(data.totalHospitalBeds * 0.35 - impactInfectionsByRequestedTime * 0.15);
  const impactCasesForICUByRequestedTime = Math.trunc(impactInfectionsByRequestedTime * 0.05);
  const impactCasesForVentilatorsByRequestedTime = Math.trunc(impactInfectionsByRequestedTime * 0.02);
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

  const severeimpactCurrentlyInfected = Math.trunc(data.reportedCases * 50);
  const severeimpactInfectionsByRequestedTime = Math.trunc(severeimpactCurrentlyInfected * 2 ** Math.trunc(time / 3));
  const severeimpactSevereCasesByRequestedTime = Math.trunc(severeimpactInfectionsByRequestedTime * 0.15);
  const severeImpactHospitalBedsByRequestedTime = Math.trunc(data.totalHospitalBeds * 0.35 - severeimpactInfectionsByRequestedTime * 0.15);
  const severeimpactCasesForICUByRequestedTime = Math.trunc(severeimpactInfectionsByRequestedTime * 0.05);
  const severeimpactCasesForVentilatorsByRequestedTime = Math.trunc(severeimpactInfectionsByRequestedTime * 0.02);
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
const impactDiv = document.getElementById('impact');
const severeImpactDiv = document.getElementById('sevreImpact');
const errorDiv = document.getElementById('error');
submitBtn.addEventListener('click', () => {
  const population = Number(document.getElementById('population').value);
  const timeToElapse = Number(document.getElementById('timeToElapse').value);
  const reportedCases = Number(document.getElementById('reportedCases').value);
  const totalHospitalBeds = Number(document.getElementById('totalHospitalBeds').value);
  const periodType = document.getElementById('periodType').value;
  const toSend = {
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
  };
  /* const result = covid19ImpactEstimator({
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
  }); */

  errorDiv.style.display = 'none';
  fetch('https://covid19-estimator-backend.herokuapp.com/api/v1/on-covid-19/json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      mode: 'no-cors',
      'Sec-Fetch-Mode': 'no-cors'
    },
    body: JSON.stringify(toSend)
  }).then(response => response.json()).then(dataResponse => {
    errorDiv.style.display = 'none';
    Object.keys(dataResponse.impact).forEach(key => {
      const element = document.createElement('div');
      const b = document.createElement('b');
      const span = document.createElement('span');
      b.textContent = key;
      span.textContent = dataResponse.impact[key];
      element.appendChild(b).appendChild(span);
      impactDiv.appendChild(element);
    });
    console.log(impactDiv);
  }).catch(err => {
    errorDiv.style.display = 'block';
  }); // console.log({ population, timeToElapse, reportedCases, totalHospitalBeds, periodType });
});

},{"./estimator":1}]},{},[1,2]);
