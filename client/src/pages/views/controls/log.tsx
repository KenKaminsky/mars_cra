import { IState } from './reducers/controlsReducer';
import React from 'react';

interface ILogProps {
  state: IState;
}

const Log: React.FC<ILogProps> = ({ state }) => {
  return (
    <div>
      <div>
        <div>
          Mars: {state.mars.height} X {state.mars.width}
        </div>
        {state.rovers.map((rover) => (
          <div key={rover.id}>
            <div>id: {rover.id}</div>
            <div>position: {JSON.stringify(rover.position)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Log;
