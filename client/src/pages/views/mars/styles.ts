import { Grid } from '../../shared.styles';
import styled from 'styled-components';

export const BackroundGrid = styled(Grid)`
  position: absolute;
`;

export const GridItem = styled.div`
  position: relative;
  display: inline-grid;
  justify-content: center;
  align-items: center;
  width: 100%;
  background: transparent;
  &:hover {
    border: 2px solid white;
  }
  &::before {
    content: '';
    height: 0;
    display: inline-block;
    padding-top: 100%;
    width: 1px;
    position: relative;
  }
  .content {
    align-items: center;
    justify-items: center;
    text-align: center;
  }
`;

export const GridCells = styled(GridItem)`
  border: 1px dashed rgba(255, 255, 255, 0.5);
  color: white;
`;
