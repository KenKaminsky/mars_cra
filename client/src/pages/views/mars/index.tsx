import React from 'react';
import { IState } from '../controls/reducers/controlsReducer';
import { FlexContainer, Grid } from '../../shared.styles';
import Rover from './rover';
import { BackroundGrid, GridCells } from './styles';

interface IMarsProps {
  state: IState;
}

const Mars: React.FC<IMarsProps> = ({ state: { mars, rovers } }) => {
  return (
    <FlexContainer>
      <BackroundGrid className='grid' cols={mars.width} rows={mars.height}>
        {[...Array(mars.height).keys()].map((row) =>
          [...Array(mars.width).keys()].map((col) => {
            const radjRow = mars.height - 1 - row;
            const coord = `${col}:${radjRow}`;
            return (
              <GridCells key={coord} data-testid={`grid-cell-col-${col}-grid-cell-row-${radjRow}`}>
                {coord}
              </GridCells>
            );
          }),
        )}
      </BackroundGrid>
      <Grid className='grid' cols={mars.width} rows={mars.height}>
        {rovers.map((rover) => (
          <Rover key={rover.id} rover={rover} />
        ))}
      </Grid>
    </FlexContainer>
  );
};

export default Mars;
