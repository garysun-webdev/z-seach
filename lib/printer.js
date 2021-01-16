const chalk = require('chalk');
const figlet = require('figlet');
const { isEmpty } = require('lodash');

const { removeLastCharacter } = require('./utils');

const printAppName = () =>
  console.log(
    chalk.cyan(
      figlet.textSync('z-search', {
        horizontalLayout: 'full',
        width: 80,
      })
    )
  );

const lineBreak = '----------------------';

const printEntities = (results, tableName) => {
  console.log(chalk.cyan(`Found ${results.length} in ${tableName}`));
  results.forEach((o) => {
    console.log(lineBreak);
    console.group(`${removeLastCharacter(tableName)}: ${o._id}`);
    Object.entries(o).forEach(([key, value]) =>
      console.log(`${chalk.yellow(key)}:`, `${value}\t`)
    );
    console.groupEnd();
  });
  console.log();
};

const printNoResult = (tableName) => {
  console.log(`${tableName} not found.`);
};

const printSearchConditions = ({ tableName, fieldName, fieldValue }) => {
  console.log(
    chalk.cyan(
      `Searching "${tableName}" for "${fieldName}" with a value of "${fieldValue}"...`
    )
  );
  console.log();
};

const printAllResults = (results, tableName) => {
  if (isEmpty(results)) {
    return printNoResult(tableName);
  }
  return printEntities(results, tableName);
};

module.exports = {
  printAppName,
  printAllResults,
  printNoResult,
  printEntities,
  printSearchConditions,
};
