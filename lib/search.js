const { isEmpty } = require('lodash');

const { allDataMap } = require('./dataLoader');
const { USERS, TICKETS, ORGANIZATIONS } = require('./contants');

const search = (tableName, fieldName, fieldValue) => {
  const { dataMap, dataInvertedMap } = allDataMap[tableName];
  //use dataMap to quick seach _id field
  if (fieldName === '_id') {
    const key = `${fieldValue}`.toLowerCase();
    return dataMap.get(key) ? [dataMap.get(key)] : [];
  }

  //use dataInvertedMap to search for other field
  const key = `${fieldName}-${fieldValue}`.toLowerCase();
  const ids = dataInvertedMap.get(key);
  if (!ids || isEmpty(ids)) {
    return [];
  }

  let results = [];
  ids.forEach((_id) => results.push(dataMap.get(_id)));
  return results;
};

const searchRelevantTables = (tableName, results) => {
  let usersResults = [];
  let ticketsResults = [];
  let organizationsResults = [];
  switch (tableName) {
    case USERS:
      results.forEach((user) => {
        //user.organization_id -> organization._id
        organizationsResults = [
          ...organizationsResults,
          ...search(ORGANIZATIONS, '_id', user.organization_id),
        ];
        //user._id -> ticket.submitter_id
        //user._id -> ticket.assignee_id
        ticketsResults = [
          ...ticketsResults,
          ...search(TICKETS, 'submitter_id', user._id),
          ...search(TICKETS, 'assignee_id', user._id),
        ];
      });
      //use Set to remove duplication entities
      return {
        organizationsResults: [...new Set(organizationsResults)],
        ticketsResults: [...new Set(ticketsResults)],
      };

    case TICKETS:
      results.forEach((ticket) => {
        //ticket.organization_id -> organization._id
        organizationsResults = [
          ...organizationsResults,
          ...search(ORGANIZATIONS, '_id', ticket.organization_id),
        ];
        //ticket.submitter_id -> user._id
        //ticket.assignee_id -> user._id
        usersResults = [
          ...usersResults,
          ...search(USERS, '_id', ticket.submitter_id),
          ...search(USERS, '_id', ticket.assignee_id),
        ];
      });
      //use Set to remove duplication entities
      return {
        usersResults: [...new Set(usersResults)],
        organizationsResults: [...new Set(organizationsResults)],
      };

    case ORGANIZATIONS:
      results.forEach((organization) => {
        //organization._id -> ticket.organization_id
        ticketsResults = [
          ...ticketsResults,
          ...search(TICKETS, 'organization_id', organization._id),
        ];
        //organization._id -> user.organization_id
        usersResults = [
          ...usersResults,
          ...search(USERS, 'organization_id', organization._id),
        ];
      });
      //use Set to remove duplication entities
      return {
        usersResults: [...new Set(usersResults)],
        ticketsResults: [...new Set(ticketsResults)],
      };
  }
};

module.exports = {
  search,
  searchRelevantTables,
};
