import { IRover } from '../../controls/helpers/types';
import React from 'react';
import { Arrow, RoverContainer } from './styles';

interface IRoverProps {
  rover: IRover;
}

const Rover: React.FC<IRoverProps> = ({ rover }) => {
  return (
    <RoverContainer {...rover.position} data-testid={`rover-${rover.id}`}>
      <div className='content'>
        <Arrow z={rover.position.z} />
      </div>
    </RoverContainer>
  );
};

export default Rover;
