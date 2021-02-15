import styled from 'styled-components';
import { IVector } from '../../controls/helpers/types';
import { GridItem } from '../styles';
import rover1 from './images/rover1.png';
import rover2 from './images/rover2.png';
import rover3 from './images/rover3.png';

interface IArrow {
  z: number;
}

export const Arrow = styled.div<IArrow>`
  border: solid white;
  border-width: 0 6px 6px 0;
  display: inline-block;
  padding: 6px;
  transform: rotate(
    ${(props) =>
      props.z === 0
        ? 225
        : props.z === 90
        ? 135
        : props.z === 180
        ? 45
        : props.z === 270
        ? 135
        : 0}deg
  );
`;

const randomImage = () =>
  [rover1, rover2, rover3][Math.round(Math.random() * 2)];

interface IRoverContainer extends IVector {}

export const RoverContainer = styled(GridItem)<IRoverContainer>`
  grid-column: ${(props) => props.x + ' / ' + (props.x + 1)};
  grid-row: ${(props) => props.y + ' / ' + (props.y + 1)};
  transform: ${(props) =>
    props.z === 90 ? 'rotateY(180deg)' : 'rotateY(0deg)'};
  background-image: url(${rover1});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`;
