import { IParseFile } from '../hooks/useFile';
import { COMPASS_MAP, VALID_MOVES } from './constants';
import { IInstruction, IMars, IMovementChar, IVector } from './types';

export const parseMarsSize = (line: string): IMars => {
  if (line?.length < 3) throw new Error();
  const [widthS, heightS] = line.split(' ');
  if ([widthS, heightS].some((dimention) => dimention.length === 0))
    throw new Error(
      'Could not parse landing size instruction. Make sure to provide instruction in the following form: "[width] [height]"',
    );
  const [width, height] = [widthS, heightS].map((d) => parseInt(d));
  if ([width, height].some((d) => isNaN(d) || d === 0)) throw new Error();
  return { width, height };
};

export const breakLine = (line: string): [string, string] => {
  const [coordinates, instructions] = line.split('|').map((val) => val.trim());
  if (!coordinates || !instructions) throw new Error();
  return [coordinates, instructions];
};

export const parseDeploymentCoordinates = (coordinates: string): IVector => {
  if (coordinates?.length < 'x y z'.length)
    throw new Error('Unexpected coordinates string.');
  const [x, y, z, ...rest] = coordinates.trim().split(/\s+/g);
  if ([x, y, z].some((i) => !i) || rest.length > 0)
    throw new Error('Unexpected number of coordinate values.');
  const deploymentV = {
    x: parseInt(x),
    y: parseInt(y),
    z: COMPASS_MAP[z],
  };
  if (Object.values(deploymentV).some((val) => isNaN(val) || val == null))
    throw new Error('Unexpected coordinates values.');
  return deploymentV;
};

export const parseMovementInstructions = (
  instructions: string,
): IMovementChar[] => {
  if (!instructions) throw new Error();
  const moves = instructions.trim().split(/\s*/g);
  if (moves.some((m) => !VALID_MOVES.includes(m))) throw new Error();
  return moves as IMovementChar[];
};

export const parseLine = (line: string): IInstruction => {
  const [coordinates, instructions] = breakLine(line);
  const deploy = parseDeploymentCoordinates(coordinates);
  const moves = parseMovementInstructions(instructions);
  return { deploy, moves };
};

export const parseMovementFile: IParseFile<IInstruction[]> = async ({
  data,
}) => {
  if (!data || data?.length === 0) throw new Error();
  return data.map((instructions) => {
    return parseLine(instructions);
  });
};
