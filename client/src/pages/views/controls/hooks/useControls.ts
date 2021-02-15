import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { wrapInGenerator } from '../helpers/asyncHelper';
import { IMars, IMovementChar, IRover, IVector } from '../helpers/types';
import { IState } from '../reducers/controlsReducer';
import useControlsReducer from './useControlsReducer';

export type IUseControls = {
  state: IState;
  setLandingSite: (size: IMars) => void;
  deploy: (coordinates: IVector) => IRover;
  instruct: (
    id: string,
    instructions: IMovementChar[],
    isMounted: React.MutableRefObject<boolean>,
  ) => void;
};

const useControls = (): IUseControls => {
  const [state, dispatch] = useControlsReducer();

  const setLandingSite = useCallback(
    (size: IMars) => {
      dispatch({
        type: 'SET_PLATEAU',
        payload: size,
      });
    },
    [dispatch],
  );

  const deploy = useCallback(
    (coordinates: IVector) => {
      const { x, y, z } = coordinates;
      const rover = {
        id: uuidv4(),
        position: {
          x: x + 1, //adjust to grid 1 intexed coordinates
          y: state.mars.height - y, //invert grid coord
          z: z,
        },
      };
      dispatch({
        type: 'DEPLOY',
        payload: {
          rover,
        },
      });
      return rover;
    },
    [state.mars, dispatch],
  );

  const instruct = useCallback(
    async (
      id,
      moves: IMovementChar[],
      isMounted: React.MutableRefObject<boolean>,
    ) => {
      await wrapInGenerator(
        moves,
        (m) => {
          m === 'M'
            ? isMounted.current && dispatch({ type: 'MOVE', payload: { id } })
            : isMounted.current &&
              dispatch({
                type: 'TURN',
                payload: { id, direction: m },
              });
        },
        500,
      );
    },
    [dispatch],
  );

  return { state, setLandingSite, deploy, instruct };
};

export default useControls;
