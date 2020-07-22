import { isOptionSelected, keyForOption } from './option';

type Boat = {
  id?: number;
  uniqueKey: string;
  name: string;
};

function setup() {
  const speedBoat: Boat = {
    id: 1,
    uniqueKey: 's',
    name: 'Speedy'
  };

  const tugBoat: Boat = {
    id: 2,
    uniqueKey: 't',
    name: 'Tugger'
  };

  // anotherTugBoat is also named tugger just like tugBoat but
  // has a different id
  const anotherTugBoat: Boat = {
    id: 3,
    uniqueKey: 'a',
    name: 'Tugger'
  };

  // Is the same as speedBoat but another instance with a different name
  const speedBoatCopy: Boat = {
    id: 1,
    uniqueKey: 'c',
    name: 'Speedie'
  };

  const uniqueKeyForValue = (boat: Boat) => `${boat.uniqueKey}`;
  const optionForValue = (boat: Boat) => boat.name;
  const isOptionEqual = (a: Boat, b: Boat) => a.id === b.id;

  return {
    uniqueKeyForValue,
    optionForValue,
    isOptionEqual,
    speedBoat,
    tugBoat,
    anotherTugBoat,
    speedBoatCopy
  };
}

describe('Util: isOptionSelected', () => {
  it('should when the value is undefined return false', () => {
    const { uniqueKeyForValue, optionForValue, speedBoat } = setup();

    expect(
      isOptionSelected({
        value: undefined,
        option: speedBoat,
        uniqueKeyForValue,
        optionForValue
      })
    ).toBe(false);
  });

  describe('when value is an array', () => {
    describe('when "isOptionEqual" is defined', () => {
      it('should consider a value selected when the "isOptionEqual" returns true for one item in the array', () => {
        const {
          uniqueKeyForValue,
          optionForValue,
          isOptionEqual,
          speedBoat,
          speedBoatCopy
        } = setup();

        expect(
          isOptionSelected({
            value: [speedBoatCopy],
            option: speedBoat,
            uniqueKeyForValue,
            optionForValue,
            isOptionEqual
          })
        ).toBe(true);
      });

      it('should not consider a value selected when "isOptionEqual" returns false for every item in the array', () => {
        const {
          uniqueKeyForValue,
          optionForValue,
          isOptionEqual,
          tugBoat,
          anotherTugBoat
        } = setup();

        expect(
          isOptionSelected({
            value: [tugBoat],
            option: anotherTugBoat,
            uniqueKeyForValue,
            optionForValue,
            isOptionEqual
          })
        ).toBe(false);
      });
    });

    describe('when "isOptionEqual" is not defined', () => {
      it('should consider a value selected when "keyForOption" returns the same string for one item in the array', () => {
        const {
          uniqueKeyForValue,
          optionForValue,
          speedBoat,
          speedBoatCopy,
          tugBoat,
          anotherTugBoat
        } = setup();

        expect(
          isOptionSelected({
            value: [tugBoat],
            option: { ...anotherTugBoat, uniqueKey: tugBoat.uniqueKey },
            optionForValue,
            uniqueKeyForValue
          })
        ).toBe(true);
        expect(
          isOptionSelected({
            value: [speedBoat],
            option: speedBoatCopy,
            optionForValue
          })
        ).toBe(true);
        expect(
          isOptionSelected({
            value: [{ ...tugBoat, id: undefined }],
            option: { ...anotherTugBoat, id: undefined },
            optionForValue
          })
        ).toBe(true);
      });

      it('should not consider a value selected when "keyForOption" does not return the same string for any item in the array', () => {
        const {
          uniqueKeyForValue,
          optionForValue,
          speedBoat,
          speedBoatCopy,
          tugBoat,
          anotherTugBoat
        } = setup();

        expect(
          isOptionSelected({
            value: [speedBoatCopy],
            option: speedBoat,
            optionForValue,
            uniqueKeyForValue
          })
        ).toBe(false);
        expect(
          isOptionSelected({
            value: [tugBoat],
            option: anotherTugBoat,
            optionForValue
          })
        ).toBe(false);
        expect(
          isOptionSelected({
            value: [{ ...speedBoatCopy, id: undefined }],
            option: { ...speedBoat, id: undefined },
            optionForValue
          })
        ).toBe(false);
      });
    });
  });

  describe('when value is a primitive', () => {
    describe('when "isOptionEqual" is defined', () => {
      it('should consider a value selected when the "isOptionEqual" returns true', () => {
        const {
          optionForValue,
          isOptionEqual,
          speedBoat,
          speedBoatCopy
        } = setup();

        expect(
          isOptionSelected({
            value: speedBoatCopy,
            option: speedBoat,
            optionForValue,
            isOptionEqual
          })
        ).toBe(true);
      });

      it('should not consider a value selected when "isOptionEqual" returns false', () => {
        const {
          optionForValue,
          isOptionEqual,
          tugBoat,
          anotherTugBoat
        } = setup();

        expect(
          isOptionSelected({
            value: tugBoat,
            option: anotherTugBoat,
            optionForValue,
            isOptionEqual
          })
        ).toBe(false);
      });
    });

    describe('when "isOptionEqual" is not defined', () => {
      it('should consider a value selected when "keyForOption" returns the same string', () => {
        const {
          uniqueKeyForValue,
          optionForValue,
          tugBoat,
          anotherTugBoat
        } = setup();

        expect(
          isOptionSelected({
            value: tugBoat,
            option: { ...anotherTugBoat, uniqueKey: tugBoat.uniqueKey },
            optionForValue,
            uniqueKeyForValue
          })
        ).toBe(true);
        expect(
          isOptionSelected({
            value: tugBoat,
            option: { ...anotherTugBoat, id: tugBoat.id },
            optionForValue
          })
        ).toBe(true);
        expect(
          isOptionSelected({
            value: { ...tugBoat, id: undefined },
            option: { ...anotherTugBoat, id: undefined },
            optionForValue
          })
        ).toBe(true);
      });

      it('should not consider a value selected when "keyForOption" does not return the same string', () => {
        const {
          uniqueKeyForValue,
          optionForValue,
          speedBoat,
          speedBoatCopy,
          tugBoat
        } = setup();

        expect(
          isOptionSelected({
            value: speedBoatCopy,
            option: speedBoat,
            optionForValue,
            uniqueKeyForValue
          })
        ).toBe(false);
        expect(
          isOptionSelected({
            value: tugBoat,
            option: speedBoat,
            optionForValue
          })
        ).toBe(false);
        expect(
          isOptionSelected({
            value: speedBoatCopy,
            option: { ...speedBoat, id: undefined },
            optionForValue
          })
        ).toBe(false);
      });
    });
  });
});

describe('util: keyForOption', () => {
  it('should return uniqueKey property when uniqueKeyForValue is defined', () => {
    const { optionForValue, uniqueKeyForValue, speedBoat, tugBoat } = setup();
    expect(
      keyForOption({ option: speedBoat, optionForValue, uniqueKeyForValue })
    ).toBe('s');
    expect(
      keyForOption({ option: tugBoat, optionForValue, uniqueKeyForValue })
    ).toBe('t');
  });

  it('should return id property when option is an object with an id', () => {
    const { optionForValue, speedBoat, tugBoat } = setup();
    expect(keyForOption({ option: speedBoat, optionForValue })).toBe('1');
    expect(keyForOption({ option: tugBoat, optionForValue })).toBe('2');
  });

  it('should return name property when optionForValue is defined', () => {
    const { optionForValue, speedBoat, tugBoat } = setup();
    expect(
      keyForOption({ option: { ...speedBoat, id: undefined }, optionForValue })
    ).toBe('Speedy');
    expect(
      keyForOption({ option: { ...tugBoat, id: undefined }, optionForValue })
    ).toBe('Tugger');
  });
});
