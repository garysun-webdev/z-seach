#!/usr/bin/env node
const { program } = require('commander');

const { dataStore } = require('./dataLoader');
const {
  printAppName,
  printTableMissing,
  printInvalidField,
} = require('./printer');

const { searchDataFromAllTables } = require('./searcher');
const { USERS, TICKETS, ORGANIZATIONS } = require('./contants');

printAppName();

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
    'field value is required to include. use "" to stand for empty string. e.g: -v ""'
  )
  .parse(process.argv);

const isFieldNameValid = (tableName, fieldName) => {
  if (!dataStore[tableName][0].hasOwnProperty(fieldName)) {
    printInvalidField(tableName, fieldName);
    return false;
  }
  return true;
};

const fieldName = program.field;
const fieldValue = program.value;

if (!program[USERS] && !program[TICKETS] && !program[ORGANIZATIONS]) {
  printTableMissing();
}

if (program[USERS] && isFieldNameValid(USERS, fieldName)) {
  searchDataFromAllTables(USERS, fieldName, fieldValue);
}

if (program[TICKETS] && isFieldNameValid(TICKETS, fieldName)) {
  searchDataFromAllTables(TICKETS, fieldName, fieldValue);
}

if (program[ORGANIZATIONS] && isFieldNameValid(ORGANIZATIONS, fieldName)) {
  searchDataFromAllTables(ORGANIZATIONS, fieldName, fieldValue);
}
