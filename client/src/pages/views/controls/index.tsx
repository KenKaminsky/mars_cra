import React, { useEffect, useRef, useState } from 'react';
import CSVReader, { IFileInfo } from 'react-csv-reader';
import { FlexContainer } from '../../shared.styles';
import { wrapInGenerator } from './helpers/asyncHelper';
import {
  parseDeploymentCoordinates,
  parseMarsSize,
  parseMovementFile,
  parseMovementInstructions,
} from './helpers/parser';
import { IInstruction } from './helpers/types';
import { IUseControls } from './hooks/useControls';
import useFile from './hooks/useFile';
import { ControlsGrid } from './styles';

const Controls: React.FC<IUseControls> = ({
  state,
  setLandingSite,
  deploy,
  instruct,
}) => {
  const isMountedRef = useRef<boolean>(false);
  const [mars, setMars] = useState('');
  const [moves, setMoves] = useState('');
  const [land, setLand] = useState('');

  const { setFile, loading, error, data } = useFile<IInstruction[]>(
    parseMovementFile,
  );

  useEffect(() => {
    isMountedRef.current = true;
    const execInstructions = async (instructions: IInstruction[]) => {
      await wrapInGenerator(
        instructions,
        async ({ deploy: vector, moves }) => {
          if (!vector || !moves || !isMountedRef.current) return;
          const rover = deploy(vector);
          await instruct(rover.id, moves, isMountedRef);
        },
        500,
      );
    };
    data && execInstructions(data);
    return () => {
      isMountedRef.current = false;
    };
  }, [data, deploy, instruct]);

  return (
    <ControlsGrid cols={2} rows={1}>
      <ControlsGrid cols={1} rows={2}>
        <div data-testid={'status-box'}>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Something went wrong...</p>
          ) : data ? (
            <p>File Loaded Successfuly</p>
          ) : (
            ''
          )}
        </div>
        <CSVReader
          data-testid={'csv-reader-input'}
          accept='.csv, text/csv'
          fileEncoding='UTF-8'
          parserOptions={{ header: false }}
          onFileLoaded={(data, fileInfo: IFileInfo) =>
            setFile({ data, fileInfo })
          }
        />
      </ControlsGrid>
      <ControlsGrid cols={2} rows={3}>
        <input
          type='text'
          data-testid={'plateau-input'}
          id='plateu'
          value={mars}
          onChange={function (e) {
            setMars(e.target.value);
          }}
        />
        <FlexContainer
          as={'button'}
          onClick={() => setLandingSite(parseMarsSize(mars))}
        >
          Set Landing Site
        </FlexContainer>
        <input
          type='text'
          data-testid={'deploy-input'}
          id='deploy'
          value={land}
          onChange={function (e) {
            setLand(e.target.value);
          }}
        />
        <FlexContainer
          as={'button'}
          onClick={() => deploy(parseDeploymentCoordinates(land))}
        >
          Deploy
        </FlexContainer>
        <input
          type='text'
          data-testid={'move-input'}
          id='move'
          value={moves}
          onChange={function (e) {
            setMoves(e.target.value);
          }}
        />
        <FlexContainer
          as={'button'}
          onClick={() =>
            instruct(
              state.rovers[0].id,
              parseMovementInstructions(moves),
              isMountedRef,
            )
          }
        >
          Move
        </FlexContainer>
      </ControlsGrid>
    </ControlsGrid>
  );
};

export default Controls;
