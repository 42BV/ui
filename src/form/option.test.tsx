import { getKeyForOption, isOptionSelected } from './option';

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

  const keyForOption = (boat: Boat) => `${boat.uniqueKey}`;
  const labelForOption = (boat: Boat) => boat.name;
  const isOptionEqual = (a: Boat, b: Boat) => a.id === b.id;

  return {
    keyForOption,
    labelForOption,
    isOptionEqual,
    speedBoat,
    tugBoat,
    anotherTugBoat,
    speedBoatCopy
  };
}

describe('Util: isOptionSelected', () => {
  it('should when the value is undefined return false', () => {
    const { keyForOption, labelForOption, speedBoat } = setup();

    expect(
      isOptionSelected({
        value: undefined,
        option: speedBoat,
        keyForOption,
        labelForOption
      })
    ).toBe(false);
  });

  describe('when value is an array', () => {
    describe('when "isOptionEqual" is defined', () => {
      it('should consider a value selected when the "isOptionEqual" returns true for one item in the array', () => {
        const {
          keyForOption,
          labelForOption,
          isOptionEqual,
          speedBoat,
          speedBoatCopy
        } = setup();

        expect(
          isOptionSelected({
            value: [speedBoatCopy],
            option: speedBoat,
            keyForOption,
            labelForOption,
            isOptionEqual
          })
        ).toBe(true);
      });

      it('should not consider a value selected when "isOptionEqual" returns false for every item in the array', () => {
        const {
          keyForOption,
          labelForOption,
          isOptionEqual,
          tugBoat,
          anotherTugBoat
        } = setup();

        expect(
          isOptionSelected({
            value: [tugBoat],
            option: anotherTugBoat,
            keyForOption,
            labelForOption,
            isOptionEqual
          })
        ).toBe(false);
      });
    });

    describe('when "isOptionEqual" is not defined', () => {
      it('should consider a value selected when "keyForOption" returns the same string for one item in the array', () => {
        const {
          keyForOption,
          labelForOption,
          speedBoat,
          speedBoatCopy,
          tugBoat,
          anotherTugBoat
        } = setup();

        expect(
          isOptionSelected({
            value: [tugBoat],
            option: { ...anotherTugBoat, uniqueKey: tugBoat.uniqueKey },
            labelForOption,
            keyForOption
          })
        ).toBe(true);
        expect(
          isOptionSelected({
            value: [speedBoat],
            option: speedBoatCopy,
            labelForOption
          })
        ).toBe(true);
        expect(
          isOptionSelected({
            value: [{ ...tugBoat, id: undefined }],
            option: { ...anotherTugBoat, id: undefined },
            labelForOption
          })
        ).toBe(true);
      });

      it('should not consider a value selected when "keyForOption" does not return the same string for any item in the array', () => {
        const {
          keyForOption,
          labelForOption,
          speedBoat,
          speedBoatCopy,
          tugBoat,
          anotherTugBoat
        } = setup();

        expect(
          isOptionSelected({
            value: [speedBoatCopy],
            option: speedBoat,
            labelForOption,
            keyForOption
          })
        ).toBe(false);
        expect(
          isOptionSelected({
            value: [tugBoat],
            option: anotherTugBoat,
            labelForOption
          })
        ).toBe(false);
        expect(
          isOptionSelected({
            value: [{ ...speedBoatCopy, id: undefined }],
            option: { ...speedBoat, id: undefined },
            labelForOption
          })
        ).toBe(false);
      });
    });
  });

  describe('when value is a primitive', () => {
    describe('when "isOptionEqual" is defined', () => {
      it('should consider a value selected when the "isOptionEqual" returns true', () => {
        const { labelForOption, isOptionEqual, speedBoat, speedBoatCopy } =
          setup();

        expect(
          isOptionSelected({
            value: speedBoatCopy,
            option: speedBoat,
            labelForOption,
            isOptionEqual
          })
        ).toBe(true);
      });

      it('should not consider a value selected when "isOptionEqual" returns false', () => {
        const { labelForOption, isOptionEqual, tugBoat, anotherTugBoat } =
          setup();

        expect(
          isOptionSelected({
            value: tugBoat,
            option: anotherTugBoat,
            labelForOption,
            isOptionEqual
          })
        ).toBe(false);
      });
    });

    describe('when "isOptionEqual" is not defined', () => {
      it('should consider a value selected when "keyForOption" returns the same string', () => {
        const { keyForOption, labelForOption, tugBoat, anotherTugBoat } =
          setup();

        expect(
          isOptionSelected({
            value: tugBoat,
            option: { ...anotherTugBoat, uniqueKey: tugBoat.uniqueKey },
            labelForOption,
            keyForOption
          })
        ).toBe(true);
        expect(
          isOptionSelected({
            value: tugBoat,
            option: { ...anotherTugBoat, id: tugBoat.id },
            labelForOption
          })
        ).toBe(true);
        expect(
          isOptionSelected({
            value: { ...tugBoat, id: undefined },
            option: { ...anotherTugBoat, id: undefined },
            labelForOption
          })
        ).toBe(true);
      });

      it('should not consider a value selected when "keyForOption" does not return the same string', () => {
        const {
          keyForOption,
          labelForOption,
          speedBoat,
          speedBoatCopy,
          tugBoat
        } = setup();

        expect(
          isOptionSelected({
            value: speedBoatCopy,
            option: speedBoat,
            labelForOption,
            keyForOption
          })
        ).toBe(false);
        expect(
          isOptionSelected({
            value: tugBoat,
            option: speedBoat,
            labelForOption
          })
        ).toBe(false);
        expect(
          isOptionSelected({
            value: speedBoatCopy,
            option: { ...speedBoat, id: undefined },
            labelForOption
          })
        ).toBe(false);
      });
    });
  });
});

describe('util: getKeyForOption', () => {
  it('should return uniqueKey property when keyForOption is defined', () => {
    const { labelForOption, keyForOption, speedBoat, tugBoat } = setup();
    expect(
      getKeyForOption({ option: speedBoat, labelForOption, keyForOption })
    ).toBe('s');
    expect(
      getKeyForOption({ option: tugBoat, labelForOption, keyForOption })
    ).toBe('t');
  });

  it('should return id property when option is an object with an id', () => {
    const { labelForOption, speedBoat, tugBoat } = setup();
    expect(getKeyForOption({ option: speedBoat, labelForOption })).toBe('1');
    expect(getKeyForOption({ option: tugBoat, labelForOption })).toBe('2');
  });

  it('should return name property when labelForOption is defined', () => {
    const { labelForOption, speedBoat, tugBoat } = setup();
    expect(
      getKeyForOption({
        option: { ...speedBoat, id: undefined },
        labelForOption
      })
    ).toBe('Speedy');
    expect(
      getKeyForOption({ option: { ...tugBoat, id: undefined }, labelForOption })
    ).toBe('Tugger');
  });
});
