import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase/app'
import 'firebase/database'


const firebaseConfig = {
  apiKey: "AIzaSyDvvVMJeBf129pEMREZYY5IlAl9JrDoua0",
  authDomain: "jellytree-3cb33.firebaseapp.com",
  databaseURL: "https://jellytree-3cb33.firebaseio.com",
  projectId: "jellytree-3cb33",
  storageBucket: "jellytree-3cb33.appspot.com",
  messagingSenderId: "12612427352",
  appId: "1:12612427352:web:1e2b19cad82b60ab"
}

firebase.initializeApp(firebaseConfig)

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
