const { USERS, TICKETS, ORGANIZATIONS } = require('./contants');

const dataStore = {
  [USERS]: require('../dataset/users.json'),
  [TICKETS]: require('../dataset/tickets.json'),
  [ORGANIZATIONS]: require('../dataset/organizations.json'),
};

const generateMapFromDataSet = (dataSet) => {
  let dataMap = new Map();
  let dataInvertedMap = new Map();

  dataSet.forEach((o) => {
    //generate dataMap
    dataMap.set(String(o._id), o);
    //generate dataInvertedMap
    const { _id, ...objectWithoutId } = o;
    Object.entries(objectWithoutId).forEach(([k, v]) => {
      //array type field
      if (Array.isArray(v)) {
        //remove duplication array items
        [...new Set(v)].forEach((vItem) => {
          const key = `${k}-${vItem}`.toLocaleLowerCase();
          !!dataInvertedMap.get(key)
            ? dataInvertedMap.set(key, [
                ...dataInvertedMap.get(key),
                String(o._id),
              ])
            : dataInvertedMap.set(key, [String(o._id)]);
        });
        //other type field
      } else {
        const key = `${k}-${v}`.toLowerCase();
        !!dataInvertedMap.get(key)
          ? dataInvertedMap.set(key, [
              ...dataInvertedMap.get(key),
              String(o._id),
            ])
          : dataInvertedMap.set(key, [String(o._id)]);
      }
    });
  });

  return {
    dataMap,
    dataInvertedMap,
  };
};

const allDataMap = {
  [USERS]: generateMapFromDataSet(dataStore[USERS]),
  [TICKETS]: generateMapFromDataSet(dataStore[TICKETS]),
  [ORGANIZATIONS]: generateMapFromDataSet(dataStore[ORGANIZATIONS]),
};

module.exports = {
  generateMapFromDataSet,
  dataStore,
  allDataMap,
};
