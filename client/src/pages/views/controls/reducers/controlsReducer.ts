import { COMPASS_REV_MAP } from '../helpers/constants';
import { ICappedVector, controlsLimits } from '../helpers/controlsLimits';
import { IIdentifiable, IMars, IRover, IVector } from '../helpers/types';

export interface IState {
  rovers: IRover[];
  mars: IMars;
}

export type IAction =
  | { type: 'MOVE'; payload: { id: string } }
  | { type: 'SET_PLATEAU'; payload: IMars }
  | { type: 'DEPLOY'; payload: { rover: IRover } }
  | { type: 'TURN'; payload: { id: string; direction: 'L' | 'R' } };

const movesMatrix: { [key: string]: IVector } = {
  L: { x: 0, y: 0, z: -90 },
  R: { x: 0, y: 0, z: +90 },
  N: { x: 0, y: -1, z: 0 },
  S: { x: 0, y: +1, z: 0 },
  E: { x: +1, y: 0, z: 0 },
  W: { x: -1, y: 0, z: 0 },
};

const find = <T extends IIdentifiable>(id: string, arr: T[]): [number, T | null] => {
  const index = arr.findIndex((r) => r.id === id);
  const element = index === -1 ? null : arr[index];
  return [index, element];
};

const updatedList = <T extends { [key: string]: any }>(
  arr: T[],
  index: number,
  update: Partial<T>,
): T[] => {
  return [...arr.slice(0, index), { ...arr[index], ...update }, ...arr.slice(index + 1)];
};

const newPosition = (curr: IVector, change: IVector, capVector: ICappedVector): IVector =>
  Object.keys(curr).reduce(
    (acc, axis) => ({
      ...acc,
      [axis]: capVector[axis](curr[axis] + change[axis]),
    }),
    {} as IVector,
  );

const controlsReducer = (state: IState, action: IAction): IState => {
  let [index, rover, position]: [number, IRover | null, IVector | null] = [-1, null, null];
  switch (action.type) {
    case 'SET_PLATEAU':
      return { ...state, mars: action.payload };
    case 'DEPLOY':
      return {
        ...state,
        rovers: [action.payload.rover, ...state.rovers],
      };
    case 'TURN':
      [index, rover] = find(action.payload.id, state.rovers);
      if (rover === null) return state;

      position = newPosition(
        rover.position,
        movesMatrix[action.payload.direction],
        controlsLimits({ maxX: state.mars.width, maxY: state.mars.height, maxZ: 360 }),
      );
      return {
        ...state,
        rovers: updatedList(state.rovers, index, { position }),
      };
    case 'MOVE':
      [index, rover] = find(action.payload.id, state.rovers);
      if (rover === null) return state;

      position = newPosition(
        rover.position,
        movesMatrix[COMPASS_REV_MAP[rover.position.z]],
        controlsLimits({ maxX: state.mars.width, maxY: state.mars.height, maxZ: 360 }),
      );
      return {
        ...state,
        rovers: updatedList(state.rovers, index, { position }),
      };
    default:
      return state;
  }
};

export default controlsReducer;
