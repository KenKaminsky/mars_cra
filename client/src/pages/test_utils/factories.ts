import {
  COMPASS_MAP,
  COMPASS_REV_MAP,
  VALID_MOVES,
} from '../views/controls/helpers/constants';
import {
  IInstruction,
  IMovementChar,
  IRover,
  IVector,
} from '../views/controls/helpers/types';
import * as Factory from 'factory.ts';
import faker from 'faker';

const randomCompassPoint = () => {
  const zOptions = Object.entries(COMPASS_MAP);
  const index = Math.round(Math.random() * (zOptions.length - 1));
  const randomZ = zOptions[index];
  return randomZ;
};

export const deploymentArgsFactory = (): [string, IVector] => {
  const randomZ = randomCompassPoint();
  const randomX = faker.random.number(50);
  const randomY = faker.random.number(50);
  const args = `${randomX} ${randomY} ${randomZ[0]}`;
  const vector = {
    x: randomX,
    y: randomY,
    z: randomZ[1],
  };
  return [args, vector];
};

export const vactorFactory = Factory.Sync.makeFactory<IVector>({
  x: Factory.each(() => faker.random.number(50)),
  y: Factory.each(() => faker.random.number(50)),
  z: Factory.each(() => randomCompassPoint()[1]),
});

const randomMove = () => {
  const index = Math.round(Math.random() * (VALID_MOVES.length - 1));
  return VALID_MOVES[index];
};

export const instrcutionsFactory = Factory.Sync.makeFactory<IInstruction>({
  deploy: Factory.each(() => vactorFactory.build()),
  moves: Factory.each(() =>
    Array(3)
      .fill(0)
      .map(() => randomMove() as IMovementChar),
  ),
});

const randomFileLine = () => {
  const deploy = vactorFactory.build();
  const deployString = `${deploy.x} ${deploy.y} ${COMPASS_REV_MAP[deploy.z]}`;

  const moves = Array(3)
    .fill(0)
    .map(() => randomMove() as IMovementChar);
  return `${deployString} | ${moves.join(' ')}`;
};

export const newFile = (content: string[]): File =>
  new File(content, 'movements.csv', { type: 'text/csv' });

export const fileLineFactory = Factory.Sync.makeFactory<{ line: string }>({
  line: Factory.each(() => randomFileLine()),
});

export const roverFactory = Factory.Sync.makeFactory<IRover>({
  id: Factory.each(() => faker.random.uuid()),
  position: Factory.each(() => vactorFactory.build()),
});
