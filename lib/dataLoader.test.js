const { generateMapFromDataSet } = require('./dataLoader');

describe('generateIndexFromDataSet', () => {
  describe('generate dataMap', () => {
    it('should generate Map by "_id:value"', () => {
      const dataSet = [
        {
          _id: 'id1',
          key1: 'value1',
          key2: 'value2',
        },
        {
          _id: 'id2',
          key1: 'value1',
          key2: 'value2',
        },
      ];
      const { dataMap } = generateMapFromDataSet(dataSet);
      expect(dataMap).size = dataSet.length;
      dataSet.forEach((o, i) => {
        expect(o).toEqual(dataMap.get(o._id));
      });
    });
    it('should convert _id from number to string as the key', () => {
      const dataSet = [
        {
          _id: 1,
          key1: 'value1',
          key2: 'value2',
        },
        {
          _id: 2,
          key1: 'value1',
          key2: 'value2',
        },
      ];
      const { dataMap } = generateMapFromDataSet(dataSet);
      expect(dataMap).size = dataSet.length;
      dataSet.forEach((o, i) => {
        expect(o).toEqual(dataMap.get(String(o._id)));
      });
    });
  });
  describe('generate dataInvertedMap', () => {
    it('should remove _id from the object first, then generate Map by "[key-value]:[_id]"', () => {
      const dataSet = [
        {
          _id: 'id1',
          key1: 'value1',
          key2: 'value2',
        },
        {
          _id: 'id2',
          key1: 'value3',
          key2: 'value4',
        },
      ];
      const { dataInvertedMap } = generateMapFromDataSet(dataSet);
      const expectedMapKeys = [
        'key1-value1',
        'key2-value2',
        'key1-value3',
        'key2-value4',
      ];
      const expectedMapValues = [['id1'], ['id1'], ['id2'], ['id2']];
      expect(Array.from(dataInvertedMap.keys())).toEqual(expectedMapKeys);
      expect(Array.from(dataInvertedMap.values())).toEqual(expectedMapValues);
    });
    it('should convert _id from number to string as value', () => {
      const dataSet = [
        {
          _id: 1,
          key1: 'value1',
          key2: 'value2',
        },
        {
          _id: 2,
          key1: 'value3',
          key2: 'value4',
        },
      ];
      const { dataInvertedMap } = generateMapFromDataSet(dataSet);
      const expectedMapKeys = [
        'key1-value1',
        'key2-value2',
        'key1-value3',
        'key2-value4',
      ];
      const expectedMapValues = [['1'], ['1'], ['2'], ['2']];
      expect(Array.from(dataInvertedMap.keys())).toEqual(expectedMapKeys);
      expect(Array.from(dataInvertedMap.values())).toEqual(expectedMapValues);
    });
    describe('when different keys have the same value between objects in dataSet', () => {
      it('should push the corresponding ids into the same array', () => {
        const dataSet = [
          {
            _id: 'id1',
            key1: 'value1',
            key2: 'value2',
          },
          {
            _id: 'id2',
            key1: 'value1',
            key2: 'value2',
          },
        ];
        const { dataInvertedMap } = generateMapFromDataSet(dataSet);
        const expectedMapKeys = ['key1-value1', 'key2-value2'];
        const expectedMapValues = [
          ['id1', 'id2'],
          ['id1', 'id2'],
        ];
        expect(Array.from(dataInvertedMap.keys())).toEqual(expectedMapKeys);
        expect(Array.from(dataInvertedMap.values())).toEqual(expectedMapValues);
      });
    });
    describe('when the value is an Array', () => {
      it('should remove duplication items first, then iterate the array and get its values', () => {
        const dataSet = [
          {
            _id: 'id1',
            key1: ['value1', 'value2', 'value3', 'value1'],
          },
          {
            _id: 'id2',
            key1: 'value3',
            key2: 'value4',
          },
        ];
        const { dataInvertedMap } = generateMapFromDataSet(dataSet);
        const expectedMapKeys = [
          'key1-value1',
          'key1-value2',
          'key1-value3',
          'key2-value4',
        ];
        const expectedMapValues = [['id1'], ['id1'], ['id1', 'id2'], ['id2']];
        expect(Array.from(dataInvertedMap.keys())).toEqual(expectedMapKeys);
        expect(Array.from(dataInvertedMap.values())).toEqual(expectedMapValues);
      });
    });
    describe('when the value is an empty string', () => {
      it('should use only [key-] as the key', () => {
        const dataSet = [
          {
            _id: 'id1',
            key1: '',
          },
        ];
        const { dataInvertedMap } = generateMapFromDataSet(dataSet);
        const expectedMapKeys = ['key1-'];
        const expectedMapValues = [['id1']];
        expect(Array.from(dataInvertedMap.keys())).toEqual(expectedMapKeys);
        expect(Array.from(dataInvertedMap.values())).toEqual(expectedMapValues);
      });
    });
  });
});
