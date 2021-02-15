import React from 'react';
import { GlobalStyles } from '../GlobalStyles';
import Layout from './views/layout';
import { FlexContainer } from './shared.styles';

const App: React.FC = () => {
  return (
    <FlexContainer className='App'>
      <GlobalStyles />
      <Layout />
    </FlexContainer>
  );
};

export default App;
