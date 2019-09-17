import React, { useState } from 'react';
import ProductTable from './components/ProductTable'
import firebase from 'firebase'
import SHA256 from 'crypto-js/sha256'
import { Form } from 'semantic-ui-react'
import styled from 'styled-components'
import _ from 'lodash'

const Flex = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
`

const getPassword = async () => {
  const db = firebase.firestore()
  const docRef = db.collection("cms").doc("dywd9nFw0nVq3DeTMLnN");
  try {
    const doc = await docRef.get()
    if (doc.exists) {
      return doc.data()
    } else {
      console.log("No such document!")
    }
  } catch (error) {
    console.log("Error getting document:", error);
  }
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem("isCMSAuthenticated")
  )

  const [password, setPassword] = useState("")
  const handleChange = (e, { name, value }) => {
    setPassword(value)
  }
  const handleSubmit = async () => {
    const expectedPassword = await getPassword()
    if (_.isEqual(expectedPassword.password, SHA256(password).words)) {
      setIsAuthenticated(true)
      sessionStorage.setItem("isCMSAuthenticated", true)
    } else {
      alert("Password is wrong!")
    }
  }

  return (
    isAuthenticated
      ? <ProductTable />
      : <Flex>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Input
              label="Enter password"
              type='password'
              value={password}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Button content='Submit' />
          </Form.Group>
        </Form>
      </Flex>
  );
}


export default App;
