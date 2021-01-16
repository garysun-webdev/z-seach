const {
  search,
  searchRelevantTables,
  searchDataFromAllTables,
} = require('./searcher');
const { generateMapFromDataSet, allDataMap } = require('./dataLoader');
const { printResults, printNoResult } = require('./printer');
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
        tickets: [tickets[1], tickets[0]],
        organizations: [organizations[0]],
      });
    });
    it('returns [] for ticketsResults/organizationsResults when no entities found', () => {
      expect(searchRelevantTables(USERS, [users[1]])).toEqual({
        tickets: [tickets[1]],
        organizations: [],
      });
    });
  });
  describe('when search from tickets', () => {
    it('can find relevant users/organizations and remove duplications', () => {
      expect(searchRelevantTables(TICKETS, tickets)).toEqual({
        users: users,
        organizations: [organizations[0]],
      });
    });
    it('returns [] for usersResults/organizationsResults when no entities found', () => {
      expect(searchRelevantTables(TICKETS, [tickets[1]])).toEqual({
        users: users,
        organizations: [],
      });
    });
  });
  describe('when search from organizations', () => {
    it('can find relevant tickets/users and remove duplications', () => {
      expect(searchRelevantTables(ORGANIZATIONS, organizations)).toEqual({
        tickets: [tickets[0]],
        users: [users[0]],
      });
    });
    it('returns [] for ticketsResults/usersResults when no entities found', () => {
      expect(searchRelevantTables(ORGANIZATIONS, [organizations[1]])).toEqual({
        tickets: [],
        users: [],
      });
    });
  });
});

jest.mock('./printer', () => ({
  ...jest.requireActual('./printer'),
  printResults: jest.fn(),
  printNoResult: jest.fn(),
}));

afterEach(() => {
  printResults.mockClear();
  printNoResult.mockClear();
});

describe('searchDataFromAllTables', () => {
  describe('search from users', () => {
    it('can get relevant data and print all out', () => {
      searchDataFromAllTables(USERS, 'name', 'Francisca Rasmussen');
      expect(printResults).toHaveBeenCalledTimes(3);
      expect(printResults).toHaveBeenNthCalledWith(1, [users[0]], USERS);
      expect(printResults).toHaveBeenNthCalledWith(
        2,
        [tickets[1], tickets[0]],
        TICKETS
      );
      expect(printResults).toHaveBeenNthCalledWith(
        3,
        [organizations[0]],
        ORGANIZATIONS
      );
    });

    it('triggers printNoResult when no result from the search', () => {
      searchDataFromAllTables(USERS, 'name', 'Francisca Rasmussenenenen');
      expect(printNoResult).toHaveBeenCalled();
      expect(printNoResult).toHaveBeenCalledWith(USERS);
    });
  });

  describe('search from tickets', () => {
    it('can get relevant data and print all out', () => {
      searchDataFromAllTables(TICKETS, 'description', 'Nostrud ad sit.');
      expect(printResults).toHaveBeenCalledTimes(3);
      expect(printResults).toHaveBeenNthCalledWith(1, [tickets[0]], TICKETS);
      expect(printResults).toHaveBeenNthCalledWith(2, [users[0]], USERS);
      expect(printResults).toHaveBeenNthCalledWith(
        3,
        [organizations[0]],
        ORGANIZATIONS
      );
    });

    it('triggers printNoResult when no result from the search', () => {
      searchDataFromAllTables(TICKETS, 'description', 'Nostrud ad sit...');
      expect(printNoResult).toHaveBeenCalled();
      expect(printNoResult).toHaveBeenCalledWith(TICKETS);
    });
  });
  describe('search from organizations', () => {
    it('can get relevant data and print all out', () => {
      searchDataFromAllTables(ORGANIZATIONS, 'details', 'MegaCorp');
      expect(printResults).toHaveBeenCalledTimes(3);
      expect(printResults).toHaveBeenNthCalledWith(
        1,
        [organizations[0]],
        ORGANIZATIONS
      );
      expect(printResults).toHaveBeenNthCalledWith(2, [users[0]], USERS);
      expect(printResults).toHaveBeenNthCalledWith(3, [tickets[0]], TICKETS);
    });

    it('triggers printNoResult when no result from the search', () => {
      searchDataFromAllTables(ORGANIZATIONS, 'details', 'MegaCorpaa');
      expect(printNoResult).toHaveBeenCalled();
      expect(printNoResult).toHaveBeenCalledWith(ORGANIZATIONS);
    });
  });
});
