import { cleanup } from '@testing-library/react';
import React from 'react';
import * as renderer from 'react-test-renderer';
import 'jest-styled-components';
import Rover from '.';

afterEach(cleanup);

const roverMock = {
  id: '1234-114564',
  position: { x: 2, y: 2, z: 90 },
};

const rover = <Rover rover={roverMock} />;

test('Rover is being rendered', () => {
  const component = renderer.create(rover);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
