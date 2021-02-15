import styled from 'styled-components';

export const BaseContainer = styled.div`
  min-height: 100%;
  min-width: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

export const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1rem;

  height: 100%;
  width: 100%;
  transition: all 500ms;
  overflow: hidden;
`;

export const RowContainer = styled(FlexContainer)`
  flex-direction: row;
  justify-content: space-around;
`;

interface IGrid {
  cols: number;
  rows: number;
}

export const Grid = styled.div<IGrid>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.cols}, 1fr);
  grid-template-rows: repeat(${(props) => props.rows}, 1fr);
  height: 100%;
  width: 100%;
`;
