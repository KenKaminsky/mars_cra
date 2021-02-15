import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import App from './App';
import { instrcutionsFactory } from './test_utils/factories';
import * as parser from './views/controls/helpers/parser';
import { IInstruction } from './views/controls/helpers/types';

jest.useFakeTimers('modern');
jest.runAllTimers();
jest.setTimeout(1000);

const file = new File(['0 0 N | 1 2 3'], 'movements.csv', { type: 'text/csv' });

const successParserResponse: IInstruction[] = [
  { deploy: { x: 1, y: 2, z: 90 }, moves: ['L', 'R', 'M'] },
];

describe('<App />', () => {
  describe('upload file', () => {
    it('should render loading state correctly', async () => {
      const mock = jest
        .spyOn(parser, 'parseMovementFile')
        .mockImplementation(async () => await new Promise(() => void 0));

      render(<App />);

      const input = document.getElementsByClassName('csv-input')[0] as HTMLInputElement;
      userEvent.upload(input, file);

      const status = screen.getByTestId(/status-box/i);
      expect(status.innerText).toBeUndefined();

      expect(await screen.findByText(/Loading.../i)).toBeInTheDocument();
      mock.mockRestore();
    });

    it('should render success state correctly', async () => {
      const mock = jest
        .spyOn(parser, 'parseMovementFile')
        .mockImplementation(
          async () => await new Promise((res) => setTimeout(() => res(successParserResponse), 0)),
        );

      render(<App />);

      const input = document.getElementsByClassName('csv-input')[0] as HTMLInputElement;
      userEvent.upload(input, file);

      expect(await screen.findByText(/File Loaded Successfuly/i)).toBeInTheDocument();
      mock.mockRestore();
    });

    it('should render error state correctly', async () => {
      const mock = jest.spyOn(parser, 'parseMovementFile').mockImplementation(() => {
        throw new Error();
      });

      render(<App />);

      const input = document.getElementsByClassName('csv-input')[0] as HTMLInputElement;
      userEvent.upload(input, file);

      expect(await screen.findByText(/Something went wrong.../i)).toBeInTheDocument();
      mock.mockRestore();
    });

    describe.each([
      [instrcutionsFactory.buildList(0)],
      [instrcutionsFactory.buildList(1)],
      [instrcutionsFactory.buildList(3)],
      [instrcutionsFactory.buildList(6)],
    ])('should render the right number of rovers', (successParserResponse) => {
      it(`called with (${successParserResponse.length})`, async () => {
        const mock = jest
          .spyOn(parser, 'parseMovementFile')
          .mockImplementation(
            async () => await new Promise((res) => setTimeout(() => res(successParserResponse), 0)),
          );

        render(<App />);

        const input = document.getElementsByClassName('csv-input')[0] as HTMLInputElement;
        userEvent.upload(input, file);

        expect(await screen.findByText(/File Loaded Successfuly/i)).toBeInTheDocument();
        successParserResponse.length === 0
          ? await waitFor(() => {
              expect(screen.queryByText(/rover-/i)).not.toBeInTheDocument();
            })
          : await waitFor(
              () =>
                expect(screen.getAllByTestId(/rover-/i).length).toEqual(
                  successParserResponse.length,
                ),
              { timeout: 1000 },
            );
        mock.mockRestore();
      });
    });

    it.each([
      ['2 2', { cols: 2, rows: 2 }],
      ['2 4', { cols: 2, rows: 4 }],
      ['6 2', { cols: 6, rows: 2 }],
      ['10 10', { cols: 10, rows: 10 }],
      ['10 20', { cols: 10, rows: 20 }],
      ['20 10', { cols: 20, rows: 10 }],
    ])('should render plateau grid correctly (%s)', async (gridInput, expected) => {
      render(<App />);

      const plateauInput = screen.getByTestId(/plateau-input/i) as HTMLInputElement;
      expect(plateauInput).toBeInTheDocument();
      expect(plateauInput.value).toBe('');
      fireEvent.change(plateauInput, { target: { value: gridInput } });
      expect(plateauInput.value).toBe(gridInput);

      screen.getByText(/Set Landing Site/i).click();

      expect((await screen.findAllByTestId(/grid-cell-row-0/i)).length).toEqual(expected.cols);
      expect((await screen.findAllByTestId(/grid-cell-col-0/i)).length).toEqual(expected.rows);
    });
  });
});
