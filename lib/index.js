#!/usr/bin/env node
const { program } = require('commander');

const { dataStore } = require('./dataLoader');
const { search, searchRelevantTables } = require('./searcher');
const {
  printAppName,
  printAllResults,
  printSearchConditions,
} = require('./printer');
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
  printSearchConditions({ tableName: USERS, fieldName, fieldValue });

  const usersResults = search(USERS, fieldName, fieldValue);
  const { organizationsResults, ticketsResults } = searchRelevantTables(
    USERS,
    usersResults
  );
  Object.entries({
    [USERS]: usersResults,
    [TICKETS]: ticketsResults,
    [ORGANIZATIONS]: organizationsResults,
  }).forEach(([tableName, results]) => printAllResults(results, tableName));
}

if (program[TICKETS] && isFieldNameValid(TICKETS, fieldName)) {
  printSearchConditions({ tableName: TICKETS, fieldName, fieldValue });

  const ticketsResults = search(TICKETS, fieldName, fieldValue);
  const { organizationsResults, usersResults } = searchRelevantTables(
    TICKETS,
    ticketsResults
  );
  Object.entries({
    [TICKETS]: ticketsResults,
    [USERS]: usersResults,
    [ORGANIZATIONS]: organizationsResults,
  }).forEach(([tableName, results]) => printAllResults(results, tableName));
}

if (program[ORGANIZATIONS] && isFieldNameValid(ORGANIZATIONS, fieldName)) {
  printSearchConditions({ tableName: ORGANIZATIONS, fieldName, fieldValue });

  const organizationsResults = search(ORGANIZATIONS, fieldName, fieldValue);
  const { ticketsResults, usersResults } = searchRelevantTables(
    ORGANIZATIONS,
    organizationsResults
  );
  Object.entries({
    [ORGANIZATIONS]: organizationsResults,
    [TICKETS]: ticketsResults,
    [USERS]: usersResults,
  }).forEach(([tableName, results]) => printAllResults(results, tableName));
}
