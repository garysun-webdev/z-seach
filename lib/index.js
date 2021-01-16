#!/usr/bin/env node
const { program } = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');

const { dataStore } = require('./dataLoader');
const { search } = require('./search');
const { USERS, TICKETS, ORGANIZATIONS } = require('./contants');

console.log(
  chalk.cyan(
    figlet.textSync('z-search', {
      horizontalLayout: 'full',
      width: 80,
    })
  )
);

program
  .version('1.0.0')
  .description('A Simple Search CLI Based on Node.js')
  .option('-u, --users', 'search users table')
  .option('-t, --tickets', 'search tickets table')
  .option('-o, --organizations', 'search organizations table')
  .requiredOption(
    '-f, --field <field name>',
    'field name is required to include'
  )
  .requiredOption(
    '-v, --value <field value>',
    'field value is required to include'
  )
  .parse(process.argv);

const isFieldNameValid = (tableName, fieldName) => {
  if (!dataStore[tableName][0].hasOwnProperty(fieldName)) {
    return false;
  }
  return true;
};

const fieldName = program.field;
const fieldValue = program.value;

if (program[USERS] && isFieldNameValid(USERS, fieldName)) {
  const users = search(USERS, fieldName, fieldValue);
}
if (program[TICKETS] && isFieldNameValid(TICKETS, fieldName)) {
  search(USERS, fieldName, fieldValue);
}
if (program[ORGANIZATIONS] && isFieldNameValid(ORGANIZATIONS, fieldName)) {
  search(USERS, fieldName, fieldValue);
}

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
