import React from 'react';
import ProductTable from './components/ProductTable'
import styled from 'styled-components'
import { Button } from 'semantic-ui-react'

const Container = styled.div`
  text-align: right;
`
const StyledButton = styled(Button)`
  &&& {
    margin: 1em;
  }
`

function App() {
  return (
    <Container>
      <StyledButton color="blue">NEW</StyledButton>
      <StyledButton color="green">SAVE</StyledButton>
      <ProductTable />
    </Container>
  );
}

export default App;
