# Z - Search

A simple command line application to search the provided data and return the results in a human readable format.

![Screenshot](screenShot.png)

## Features

- Case-insensitive and full-value (including empty values and array item) searching for any field in users, tickets and organizations.
- Retrieve all relevant data based on the relationships between different tables. (e.g. searching tickets can get users and organizations related to these tickets)
- Handle and display error when invalid values are provided
- Use inverted index to achieve O(1) search efficiency , which has good performance to handle large dataset.
- Modulized and fully tested source code, which is easy to be extended.

## Trade-off  
  - Sacrifice space and init time to improve the runtime searching efficiency by generating two indexes for each table: 
    - normal index: {id1: {key: value}}
    - inverted index: {"key-value": [id1, id2]}
  - When user searches for a value in a field, the system uses inverted index to find the ids first(O(1)), then use each id to retrieve the whole value(O(1)).
  
## Assumptions

- The CLI gets params into `string`, so when generating inverted indexes, we use string lowercase as keys: {"key-value": [id1, id2]}. If the key points to array value, we interate the array to get the item as the value. e.g. {id1: {tag: [tag1,tag2]}} would be generated as {tag-tag1:[id1], tag-tag2:[id1]}. User should search for array item value to get the result instead of seaching for while array.

correct: 
```sh
$ z-search -u -f tags -v "tag1"
```

incorrect:
```sh
$ z-search -u -f tags -v "[tag1,tag2]"
```

- one ticket can link to possible two users by `submitter_id` and `assignee_id`, and other entities are connected by `organization_id`.
- The entity structure is decided by the first element in the table. E.g We use users[0] to decide all the fields in a user.


## Architecture

The architecture of the source code is shown as below.

- dataLoader is responsible for loading the data and generating index map and inverted index map.
- printer is responsible for printing messages on the screen.
- searcher interacts with dataLoader and printer to provide searching apis.
- index has the CLI interactive logic and interacts with both user and searcher
- utils has some util functions serving searcher

![Architecture](architecture.png)

## Usage

Z-Search requires [Node.js](https://nodejs.org/) v12.16.3+ to run.

Install the dependencies and start the cli.

```sh
$ cd z-search
$ npm i
$ npm run setup
```

If `$npm run setup` fails, try this command below. It would ask you to type in Admin password to allow installing package globally in your system. (no harm, don't worry :))

```sh
$ npm run setup:sudo
```

Run testing

```sh
$ cd z-search
$ npm i
$ npm run test
$ npm run coverage
```

Run search:

```sh
$ z-search [-u/-t/-o] -f <fieldName> -v <fieldValue>
```

z-search support seaching fieldName with fieldValue within one or multiple tables, which means these two below are equal:

```sh
$ z-search -u -t -f _id_ -v '1'
```

```sh
$ z-search -u -f _id_ -v '1'
$ z-search -t -f _id_ -v '1'
```

## Usage Examples

- Check the version of this search cli

```sh
$ z-search -V
```

- Look for help for usages

```sh
$ z-search -h
```

- Search users by any field. It will return all relavent tickets and organizations.

```sh
$ z-search -u -f name -v 'Francisca Rasmussen'

//search users for alias with a value of empty
$ z-search -u -f alias -v '‘
```

- Search tickets by any field. It will return all relavent organizations and users.

```sh
$ z-search -t -f subject -v 'A Nuisance in Ghana'
$ z-search -t -f has_incidents -v 'false'
```

- Search organizations by any field. It will return all relavent users and tickets

```sh
$ z-search -o -f details -v 'non profit'
$ z-search -o -f submitter_id -v '4'
```

## Dependency

Z-Search uses these open-source libraries below:

- [Commander](https://www.npmjs.com/package/commander)
- [figlet](https://www.npmjs.com/package/figletr)
- [chalk](https://www.npmjs.com/package/chalk)
- [lodash](https://www.npmjs.com/package/lodash)
- [Jest](https://www.npmjs.com/package/jest)
