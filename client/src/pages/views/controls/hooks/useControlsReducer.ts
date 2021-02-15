import controlsReducer, { IAction, IState } from '../reducers/controlsReducer';
import { useReducer } from 'react';

const initState: IState = {
  rovers: [],
  mars: { height: 6, width: 6 },
};

const useControlsReducer = (): [IState, React.Dispatch<IAction>] => {
  const [state, dispatch] = useReducer(controlsReducer, initState);
  return [state, dispatch];
};

export default useControlsReducer;
