/**
 * Utils functions that are shared among multible modules are contained here.
 */

const { AVG_CO2_EMIS_FLIGHTS, CIRCUM_EARTH } = require('./const');


/**
* @param {function} fn - Async function to be wrapped into an error catching function.
*
* @returns {function} Error catching function wrapping the original function.
*/
function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}


/**
 * @param {*} id - Identifier to check if is a number.
 *
 * @returns {boolean} Return true if id is a number.
 */
function isNumber(id) {
  return /^\d+$/.test(id); // regluleg segð sem skilar true ef id er tala en false annars
}


/**
 * @param {*} s - Variable to check if is empty string.
 *
 * @returns {boolean} Return true if s is a string and non-empty.
 */
function isNonEmptyString(s) {
  return (typeof s === 'string') && (s.length > 0);
}

function calcGrade(prod) {
  let total = 0;
  total += prod.packaging_footprint * prod.packaging_weight;
  total += (prod.origin_distance) * AVG_CO2_EMIS_FLIGHTS[2];

  const maxTotal = 12.025 + AVG_CO2_EMIS_FLIGHTS[2] * (CIRCUM_EARTH * 0.5);

  let grade = (total * 10) / maxTotal;

  grade += prod.score; // Not CO2
  grade += (prod.packaging_breakdown_time * 10) / 1000; // Not CO2
  grade += 10 - (prod.packaging_reusability * 10) / 3; // Not CO2

  grade /= 4;

  grade = 10 - grade;

  return grade;
}


module.exports = {
  catchErrors,
  isNumber,
  isNonEmptyString,
  calcGrade,
};
