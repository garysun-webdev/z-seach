const {
  printEntities,
  printNoResult,
  printSearchConditions,
  printResults,
} = require('./printer');
const { USERS } = require('./contants');
const chalk = require('chalk');

global.console = { log: jest.fn(), group: jest.fn(), groupEnd: jest.fn() };
jest.mock('chalk', () => ({
  cyan: jest.fn(),
  yellow: jest.fn(),
}));

describe('printer functions', () => {
  afterEach(() => {
    console.log.mockClear();
    console.group.mockClear();
    console.groupEnd.mockClear();
    chalk.cyan.mockClear();
    chalk.yellow.mockClear();
  });
  describe('printEntities', () => {
    it('should print correct message', () => {
      const results = [{ _id: 1 }, { _id: 2 }];
      const tableName = USERS;
      printEntities(results, tableName);
      expect(console.log).toHaveBeenCalledTimes(4 + results.length);
      expect(console.group).toHaveBeenCalledTimes(results.length);
      expect(console.groupEnd).toHaveBeenCalledTimes(results.length);
      expect(chalk.cyan).toHaveBeenCalledWith('Found 2 in users');
      expect(chalk.yellow).toHaveBeenNthCalledWith(1, '_id');
      expect(chalk.yellow).toHaveBeenNthCalledWith(2, '_id');
    });
  });

  describe('printNoResult', () => {
    it('should print correct message', () => {
      printNoResult(USERS);
      expect(console.log).toHaveBeenCalledWith('users not found.');
    });
  });

  describe('printSearchConditions', () => {
    it('should print correct message', () => {
      printSearchConditions({
        tableName: USERS,
        fieldName: 'name',
        fieldValue: 'Gary',
      });
      expect(chalk.cyan).toHaveBeenCalledWith(
        'Searching "users" for "name" with a value of "Gary"...'
      );
    });
  });

  describe('printResults', () => {
    it('should call printNoResult if results are empty', () => {
      printResults([], USERS);
      expect(console.log).toHaveBeenCalledWith('users not found.');
    });
    it('should call printEntities if results are not empty', () => {
      printResults([{ _id: 1 }], USERS);
      expect(chalk.cyan).toHaveBeenCalledWith('Found 1 in users');
    });
  });
});
