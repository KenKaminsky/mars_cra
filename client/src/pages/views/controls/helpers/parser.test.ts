import { waitFor } from '@testing-library/react';
import { deploymentArgsFactory } from '../../../test_utils/factories';
import * as parser from './parser';
import { IMovementChar } from './types';

describe('parser', () => {
  describe('parseMarsSize', () => {
    describe.each([
      ['1 2', { width: 1, height: 2 }],
      ['10 2', { width: 10, height: 2 }],
      ['1 20', { width: 1, height: 20 }],
      ['10 20', { width: 10, height: 20 }],
      ['100 200', { width: 100, height: 200 }],
    ])('called with ("%s")', (input, expected) => {
      it(`returns ${JSON.stringify(expected)}`, () => {
        expect(parser.parseMarsSize(input)).toStrictEqual(expected);
      });
    });

    describe.each(['12', '01', '10', '1 0', '0 1'])(
      'called with ("%s")',
      (input) => {
        it(`throws an error`, () => {
          expect(() => parser.parseMarsSize(input)).toThrowError();
        });
      },
    );
  });

  describe('breakLine', () => {
    describe.each([
      ['0 0 N | L R M', ['0 0 N', 'L R M']],
      ['10 20 E | L R ', ['10 20 E', 'L R']],
    ])('called with ("%s")', (input, expected) => {
      it(`returns ${expected}`, () => {
        expect(parser.breakLine(input)).toStrictEqual(expected);
      });
    });

    describe.each(['12 ', '|0 1', '1 0|', '1 0 L R M'])(
      'called with ("%s")',
      (input) => {
        it(`throws an error`, () => {
          expect(() => parser.breakLine(input)).toThrowError();
        });
      },
    );
  });

  describe('parseDeploymentCoordinates', () => {
    describe.each([
      ['0 0 N', { x: 0, y: 0, z: 0 }],
      ['0 0 E', { x: 0, y: 0, z: 90 }],
      ['0 0 S', { x: 0, y: 0, z: 180 }],
      ['0 0 W', { x: 0, y: 0, z: 270 }],
      [...deploymentArgsFactory()],
    ])('called with("%s")', (input, expected) => {
      it(`returns ${expected}`, () => {
        expect(parser.parseDeploymentCoordinates(input)).toStrictEqual(
          expected,
        );
      });
    });

    describe.each(['', '12 ', '0 1', '1 0|', '1 0 L R M', 'L 0 W', '10 0 T'])(
      'called with("%s")',
      (input) => {
        it(`throws an error`, () => {
          expect(() => parser.parseDeploymentCoordinates(input)).toThrowError();
        });
      },
    );
  });

  describe('parseMovementInstructions', () => {
    describe.each([
      ['L', ['L']],
      ['R', ['R']],
      ['M', ['M']],
      ['M L', ['M', 'L']],
      ['M R', ['M', 'R']],
      ['L R M', ['L', 'R', 'M']],
    ])('called with("%s")', (input, expected) => {
      it(`returns ${expected}`, () => {
        expect(parser.parseMovementInstructions(input)).toStrictEqual(expected);
      });
    });

    describe.each(['', '0 0 E', 'G B R'])('called with("%s")', (input) => {
      it(`throws an error`, () => {
        expect(() => parser.parseMovementInstructions(input)).toThrowError();
      });
    });
  });

  let mockbreakLine;
  let mockCoordParser;
  let mockMovementParser;
  const deploy = { x: 0, y: 0, z: 0 };
  const moves: IMovementChar[] = ['L', 'R', 'M'];

  describe('parseLine', () => {
    beforeEach(() => {
      mockbreakLine = jest
        .spyOn(parser, 'breakLine')
        .mockImplementation(() => ['coord', 'moves']);
      mockCoordParser = jest
        .spyOn(parser, 'parseDeploymentCoordinates')
        .mockImplementation(() => deploy);
      mockMovementParser = jest
        .spyOn(parser, 'parseMovementInstructions')
        .mockImplementation(() => moves);
    });
    afterEach(() => {
      mockbreakLine.mockRestore();
      mockCoordParser.mockRestore();
      mockMovementParser.mockRestore();
    });
    it(`calls the needed parsing functions with the right values`, () => {
      const input = '0 0 N | L R M';
      const result = parser.parseLine(input);

      expect(result).toStrictEqual({ deploy, moves });

      expect(mockbreakLine).toBeCalledTimes(1);
      expect(mockbreakLine).toHaveBeenCalledWith(input);

      expect(mockCoordParser).toBeCalledTimes(1);
      expect(mockCoordParser).toHaveBeenCalledWith('coord');

      expect(mockMovementParser).toBeCalledTimes(1);
      expect(mockMovementParser).toHaveBeenCalledWith('moves');
    });
  });

  let parseLine;
  describe('parseMovementFile', () => {
    beforeEach(() => {
      parseLine = jest
        .spyOn(parser, 'parseLine')
        .mockImplementation(() => ({ deploy, moves }));
    });
    afterEach(() => {
      parseLine.mockRestore();
    });
    it(`calls parseLine with the right number of times and with the right values`, async () => {
      const times = 3;
      const data = Array(times)
        .fill(0)
        .map((_, i) => `${i} ${i} N | L R M`);
      const input = { data };

      const result = await parser.parseMovementFile(input);

      await waitFor(
        () => {
          expect(parseLine).toHaveBeenCalledTimes(2);
        },
        { timeout: 1000 },
      );

      data.map((d, i) => {
        expect(parseLine).toHaveBeenNthCalledWith(i + 1, d);
      });
    });
  });
});
