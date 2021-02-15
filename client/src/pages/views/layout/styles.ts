import styled from 'styled-components';
import { BaseContainer, FlexContainer, RowContainer } from '../../shared.styles';
import marsbg from './images/mars_bg.jpg';

export const LayoutGrid = styled(BaseContainer)`
  display: grid;
  grid-template-areas:
    'header'
    'controls'
    'main';
  grid-template-rows: 100px 100px auto;
  background-image: url(${marsbg});
`;

export const Header = styled(FlexContainer)`
  grid-area: header;
`;

export const ControlsPanel = styled(RowContainer)`
  color: white;
  font-size: 1rem;
  grid-area: controls;
`;

export const Main = styled(FlexContainer)`
  grid-area: main;
  position: relative;
`;
