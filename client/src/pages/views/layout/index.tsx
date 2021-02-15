import React from 'react';
import useControls from '../controls/hooks/useControls';
import { ControlsPanel, Header, LayoutGrid, Main } from './styles';
import Controls from '../controls';
import Mars from '../mars';

const Layout: React.FC = () => {
  const controls = useControls();

  return (
    <LayoutGrid className='App'>
      <Header>
        <h1>Mars</h1>
      </Header>
      <ControlsPanel>
        <Controls {...controls} />
      </ControlsPanel>
      <Main>
        <Mars state={controls.state} />
      </Main>
    </LayoutGrid>
  );
};

export default Layout;
