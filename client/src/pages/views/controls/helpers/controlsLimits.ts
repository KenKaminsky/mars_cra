import { IVector } from './types';

type IMax = { maxX: number; maxY: number; maxZ: number };

export type ICappedVector = { [key in keyof IVector]: (val: number) => number };

export type ILimitControls = (max: IMax) => ICappedVector;

export const circularMax = (val: number, max: number): number => (max + val) % max;

export const minMax = (val: number, min: number, max: number): number =>
  Math.min(Math.max(val, min), max);

export const controlsLimits: ILimitControls = ({ maxX, maxY, maxZ }) => ({
  x: (val) => minMax(val, 1, maxX),
  y: (val) => minMax(val, 1, maxY),
  z: (val) => circularMax(val, maxZ),
});
