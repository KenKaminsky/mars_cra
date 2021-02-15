export type CompasPoints = 'N' | 'E' | 'S' | 'W';

export type CompasDegs = '0' | '90' | '180' | '270';

export type ICOMPASS_REV_MAP = {
  readonly [Key in CompasDegs]: CompasPoints;
};

export type IVector = { x: number; y: number; z: number };

export type IMovementChar = 'L' | 'R' | 'M';

export interface IInstruction {
  deploy: IVector | undefined;
  moves: IMovementChar[] | undefined;
}

export interface IMars {
  height: number;
  width: number;
}

export interface IIdentifiable {
  id: string;
}

export interface IRover extends IIdentifiable {
  position: IVector;
}
