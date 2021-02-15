import { CompasDegs, CompasPoints, ICOMPASS_REV_MAP } from './types';

export const COMPASS_POINTS: CompasPoints[] = ['N', 'E', 'S', 'W'];
export const COMPASS_DEGS: CompasDegs[] = ['0', '90', '180', '270'];

export const COMPASS_MAP = {
  N: 0,
  E: 90,
  S: 180,
  W: 270,
};

export const COMPASS_REV_MAP: ICOMPASS_REV_MAP = {
  0: 'N',
  90: 'E',
  180: 'S',
  270: 'W',
};

export const VALID_MOVES = ['L', 'R', 'M'];
