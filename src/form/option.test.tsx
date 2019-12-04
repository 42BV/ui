import { isOptionSelected } from './option';

type Boat = {
  id: number;
  name: string;
};

describe('Util: isOptionSelected', () => {
  function setup() {
    const speedBoat: Boat = {
      id: 1,
      name: 'Speedy'
    };

    const tugBoat: Boat = {
      id: 2,
      name: 'Tugger'
    };

    // anotherTugBoat is also named tugger just like tugBoat but
    // has a different id
    const anotherTugBoat: Boat = {
      id: 3,
      name: 'Tugger'
    };

    // Is the same as speedBoat but another instance with a different name
    const speedBoatCopy: Boat = {
      id: 1,
      name: 'Speedie'
    };

    const optionForValue = (boat: Boat) => boat.name;
    const isOptionEqual = (a: Boat, b: Boat) => a.id === b.id;

    return {
      optionForValue,
      isOptionEqual,
      speedBoat,
      tugBoat,
      anotherTugBoat,
      speedBoatCopy
    };
  }

  it('should when the value is undefined return false', () => {
    const { optionForValue, speedBoat } = setup();

    expect(
      isOptionSelected({ value: undefined, option: speedBoat, optionForValue })
    ).toBe(false);
  });

  describe('when value is an array', () => {
    describe('when "isOptionEqual" is defined', () => {
      it('should consider a value selected when the "isOptionEqual" returns true for one item in the array', () => {
        const {
          optionForValue,
          isOptionEqual,
          speedBoat,
          speedBoatCopy
        } = setup();

        expect(
          isOptionSelected({
            value: [speedBoatCopy],
            option: speedBoat,
            optionForValue,
            isOptionEqual
          })
        ).toBe(true);
      });

      it('should not consider a value selected when "isOptionEqual" returns false for every item in the array', () => {
        const {
          optionForValue,
          isOptionEqual,
          tugBoat,
          anotherTugBoat
        } = setup();

        expect(
          isOptionSelected({
            value: [tugBoat],
            option: anotherTugBoat,
            optionForValue,
            isOptionEqual
          })
        ).toBe(false);
      });
    });

    describe('when "isOptionEqual" is not defined', () => {
      it('should consider a value selected when "optionForValue" returns the same string for one item in the array', () => {
        const { optionForValue, tugBoat, anotherTugBoat } = setup();

        expect(
          isOptionSelected({
            value: [tugBoat],
            option: anotherTugBoat,
            optionForValue
          })
        ).toBe(true);
      });

      it('should not consider a value selected when "optionForValue" does not return the same string for at least one item in the array', () => {
        const { optionForValue, speedBoat, speedBoatCopy } = setup();

        expect(
          isOptionSelected({
            value: [speedBoatCopy],
            option: speedBoat,
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
      it('should consider a value selected when "optionForValue" returns the same string', () => {
        const { optionForValue, tugBoat, anotherTugBoat } = setup();

        expect(
          isOptionSelected({
            value: tugBoat,
            option: anotherTugBoat,
            optionForValue
          })
        ).toBe(true);
      });

      it('should not consider a value selected when "optionForValue" does not return the same string', () => {
        const { optionForValue, speedBoat, speedBoatCopy } = setup();

        expect(
          isOptionSelected({
            value: speedBoatCopy,
            option: speedBoat,
            optionForValue
          })
        ).toBe(false);
      });
    });
  });
});
