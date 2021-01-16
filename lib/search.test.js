const { search, searchRelevantTables } = require('./search');
const { generateMapFromDataSet, allDataMap } = require('./dataLoader');
const { USERS, TICKETS, ORGANIZATIONS } = require('./contants');

const users = [
  {
    _id: 1,
    name: 'Francisca Rasmussen',
    shared: false,
    organization_id: 119,
    tags: ['Springville', 'Sutton', 'Hartsville/Hartley', 'Diaperville'],
  },
  {
    _id: 2,
    name: 'Cross Barlow',
    shared: false,
    organization_id: 106,
    tags: ['Foxworth', 'Woodlands', 'Herlong', 'Henrietta'],
  },
];

const tickets = [
  {
    _id: 'ticket1',
    description: 'Nostrud ad sit.',
    submitter_id: 38,
    assignee_id: 1,
    organization_id: 119,
  },
  {
    _id: 'ticket2',
    description: 'Aliquip excepteur fugiat.',
    submitter_id: 1,
    assignee_id: 2,
    organization_id: 112,
  },
];

const organizations = [
  {
    _id: 119,
    details: 'MegaCorp',
  },
  {
    _id: 102,
    details: 'Non profit',
  },
];

jest.mock('./dataLoader', () => ({
  ...jest.requireActual('./dataLoader'),
  allDataMap: {},
}));

describe('search', () => {
  describe('search users', () => {
    allDataMap.users = generateMapFromDataSet(users);

    describe('search by _id', () => {
      it('can search by _id', () => {
        expect(search(USERS, '_id', 1)).toEqual([users[0]]);
      });
      it('returns [] when no ticket found', () => {
        expect(search(USERS, '_id', 3)).toEqual([]);
      });
    });

    describe('seach other fields', () => {
      it.each`
        fieldName            | fieldValue               | type         | result
        ${'name'}            | ${'Francisca Rasmussen'} | ${'string'}  | ${[users[0]]}
        ${'organization_id'} | ${119}                   | ${'number'}  | ${[users[0]]}
        ${'tags'}            | ${'Springville'}         | ${'array'}   | ${[users[0]]}
        ${'shared'}          | ${false}                 | ${'boolean'} | ${users}
        ${'tags'}            | ${'not there'}           | ${'array'}   | ${[]}
      `('can search $type value field', ({ fieldName, fieldValue, result }) => {
        expect(search(USERS, fieldName, fieldValue)).toEqual(result);
      });
    });
  });

  describe('search tickets', () => {
    allDataMap.tickets = generateMapFromDataSet(tickets);
    describe('can search by _id', () => {
      it('can search by _id', () => {
        expect(search(TICKETS, '_id', 'ticket1')).toEqual([tickets[0]]);
      });
      it('returns [] when no ticket found', () => {
        expect(search(TICKETS, '_id', 3)).toEqual([]);
      });
    });

    describe('seach other fields', () => {
      it.each`
        fieldName         | fieldValue           | type        | result
        ${'description'}  | ${'Nostrud ad sit.'} | ${'string'} | ${[tickets[0]]}
        ${'submitter_id'} | ${38}                | ${'number'} | ${[tickets[0]]}
        ${'submitter_id'} | ${'not there'}       | ${'string'} | ${[]}
      `('can search $type value field', ({ fieldName, fieldValue, result }) => {
        expect(search(TICKETS, fieldName, fieldValue)).toEqual(result);
      });
    });
  });

  describe('search organizations', () => {
    allDataMap.organizations = generateMapFromDataSet(organizations);
    describe('can search by _id', () => {
      it('can search by _id', () => {
        expect(search(ORGANIZATIONS, '_id', '119')).toEqual([organizations[0]]);
      });
      it('returns [] when no organizations found', () => {
        expect(search(ORGANIZATIONS, '_id', 3)).toEqual([]);
      });
    });

    describe('seach other fields', () => {
      it.each`
        fieldName    | fieldValue     | type        | result
        ${'details'} | ${'MegaCorp'}  | ${'string'} | ${[organizations[0]]}
        ${'details'} | ${'not there'} | ${'string'} | ${[]}
      `('can search $type value field', ({ fieldName, fieldValue, result }) => {
        expect(search(ORGANIZATIONS, fieldName, fieldValue)).toEqual(result);
      });
    });
  });
});

describe('searchRelevantTables', () => {
  describe('when search from users', () => {
    it('can find relevant tickets/organizations and remove duplications', () => {
      expect(searchRelevantTables(USERS, users)).toEqual({
        ticketsResults: [tickets[1], tickets[0]],
        organizationsResults: [organizations[0]],
      });
    });
    it('returns [] for ticketsResults/organizationsResults when no entities found', () => {
      expect(searchRelevantTables(USERS, [users[1]])).toEqual({
        ticketsResults: [tickets[1]],
        organizationsResults: [],
      });
    });
  });
  describe('when search from tickets', () => {
    it('can find relevant users/organizations and remove duplications', () => {
      expect(searchRelevantTables(TICKETS, tickets)).toEqual({
        usersResults: users,
        organizationsResults: [organizations[0]],
      });
    });
    it('returns [] for usersResults/organizationsResults when no entities found', () => {
      expect(searchRelevantTables(TICKETS, [tickets[1]])).toEqual({
        usersResults: users,
        organizationsResults: [],
      });
    });
  });
  describe('when search from organizations', () => {
    it('can find relevant tickets/users and remove duplications', () => {
      expect(searchRelevantTables(ORGANIZATIONS, organizations)).toEqual({
        ticketsResults: [tickets[0]],
        usersResults: [users[0]],
      });
    });
    it('returns [] for ticketsResults/usersResults when no entities found', () => {
      expect(searchRelevantTables(ORGANIZATIONS, [organizations[1]])).toEqual({
        ticketsResults: [],
        usersResults: [],
      });
    });
  });
});
