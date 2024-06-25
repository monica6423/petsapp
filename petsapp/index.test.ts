const { parse, stringify } = require('./index');

describe('Date Parsing and Stringifying Functions', () => {
    beforeAll(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date(Date.UTC(2020, 5, 12, 13, 20, 17, 486))); // 2020-06-12T13:20:17.486Z

    });
    
    afterAll(() => {
        jest.useRealTimers();
    });

    describe('parse function', () => {
        it('should parse "now-1y/y" correctly', () => {
            const input = 'now-1y/y';
            const expectedDate = new Date('2019-01-01T00:00:00.000Z');
            expect(parse(input)).toEqual(expectedDate);
        });

        it('should parse "now/y" correctly', () => {
            const input = 'now/y';
            const expectedDate = new Date('2020-01-01T00:00:00.000Z');
            expect(parse(input)).toEqual(expectedDate);
        });

        it('should parse "now/d" correctly', () => {
          const input = 'now/d';
          const expectedDate = new Date('2020-06-12T00:00:00.000Z');
          expect(parse(input)).toEqual(expectedDate);
        });

        it('should parse "now/h" correctly', () => {
          const input = 'now/h';
          const expectedDate = new Date('2020-06-12T13:00:00.000Z');
          expect(parse(input)).toEqual(expectedDate);
        });

        it('should parse "now/M" correctly', () => {
          const input = 'now/M';
          const expectedDate = new Date('2020-06-01T00:00:00.000Z');
          expect(parse(input)).toEqual(expectedDate);
        });

        it('should parse "now/w" correctly', () => {
          const input = 'now/w';
          const expectedDate = new Date('2020-06-07T00:00:00.000Z');
          expect(parse(input)).toEqual(expectedDate);
        });

        it('should parse "now+2d/w" correctly', () => {
          const input = 'now+2d/w';
          const expectedDate = new Date('2020-06-14T00:00:00.000Z');
          expect(parse(input)).toEqual(expectedDate);
        });

        it('should parse "now-1d" correctly', () => {
            const input = 'now-1d';
            const expectedDate = new Date('2020-06-11T13:20:17.486Z');
            expect(parse(input)).toEqual(expectedDate);
        });

        it('should parse "now+1d" correctly', () => {
            const input = 'now+1d';
            const expectedDate = new Date('2020-06-13T13:20:17.486Z');
            expect(parse(input)).toEqual(expectedDate);
        });

        it('should parse "now-4d-4h" correctly', () => {
            const input = 'now-4d-4h';
            const expectedDate = new Date('2020-06-08T09:20:17.486Z');
            expect(parse(input)).toEqual(expectedDate);
        });

        it('should parse "now-4d-4h+13m" correctly', () => {
          const input = 'now-4d-4h+13m';
          const expectedDate = new Date('2020-06-08T09:33:17.486Z');
          expect(parse(input)).toEqual(expectedDate);
        });

        it('should parse "now-4d-4h+13m/d" correctly', () => {
          const input = 'now-4d-4h+13m/d';
          const expectedDate = new Date('2020-06-08T00:00:00.000Z');
          expect(parse(input)).toEqual(expectedDate);
        });

        it('should parse "now/d-13h" correctly', () => {
          const input = 'now/d-13h';
          const expectedDate = new Date('2020-06-11T11:00:00.000Z');
          expect(parse(input)).toEqual(expectedDate);
        });

        it('should parse "now-4d/h-4h+13m/h" correctly', () => {
          const input = 'now-4d/h-4h+13m/h';
          const expectedDate = new Date('2020-06-08T09:00:00.000Z');
          expect(parse(input)).toEqual(expectedDate);
        });

        it('should throw error for invalid date string "now-4d/3h"', () => {
          const input = 'now-4d/3h';
          expect(() => parse(input)).toThrowError("Invalid sign in operation '3h'");
        });

        it('should throw error for invalid date string', () => {
            const input = 'invalid-date-string';
            expect(() => parse(input)).toThrowError("Invalid date string: Must start with 'now'.");
        });
    });

    describe('stringify function', () => {
        it('should stringify a date object to "now-1y/y"', () => {
            const inputDate = new Date('2019-01-01T00:00:00.000Z');
            const expectedString = 'now-1y/y';
            expect(stringify(inputDate)).toEqual(expectedString);
        });

        it('should stringify a date object to "now/y"', () => {
            const inputDate = new Date('2020-01-01T00:00:00.000Z');
            const expectedString = 'now/y';
            expect(stringify(inputDate)).toEqual(expectedString);
        });

        it('should stringify a date object to "now/d"', () => {
            const inputDate = new Date('2020-06-12T00:00:00.000Z');
            const expectedString = 'now/d';
            expect(stringify(inputDate)).toEqual(expectedString);
        });

        it('should stringify a date object to "now/h"', () => {
            const inputDate = new Date('2020-06-12T13:00:00.000Z');
            const expectedString = 'now/h';
            expect(stringify(inputDate)).toEqual(expectedString);
        });

        it('should stringify a date object to "now/M"', () => {
            const inputDate = new Date('2020-06-01T00:00:00.000Z');
            const expectedString = 'now/M';
            expect(stringify(inputDate)).toEqual(expectedString);
        });

        it('should stringify a date object to "now+16d/w"', () => {
            const inputDate = new Date('2020-06-28T00:00:00.000Z');
            const expectedString = 'now+16d/w';
            expect(stringify(inputDate)).toEqual(expectedString);
        });

        it('should stringify a date object to "now/m"', () => {
            const inputDate = new Date('2020-06-12T13:20:00.000Z');
            const expectedString = 'now/m';
            expect(stringify(inputDate)).toEqual(expectedString);
        });

        it('should stringify a date object to "now-1d"', () => {
            const inputDate = new Date('2020-06-11T13:20:17.486Z');
            const expectedString = 'now-1d';
            expect(stringify(inputDate)).toEqual(expectedString);
        });

        it('should stringify a date object to "now+1d"', () => {
            const inputDate = new Date('2020-06-13T13:20:17.486Z');
            const expectedString = 'now+1d';
            expect(stringify(inputDate)).toEqual(expectedString);
        });

        it('should stringify a date object to "now-4d-5h-7m"', () => {
            const inputDate = new Date('2020-06-08T08:13:17.486Z');
            const expectedString = 'now-4d-5h-7m';
            expect(stringify(inputDate)).toEqual(expectedString);
        });
    });
});
