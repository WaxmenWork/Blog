import React, { useContext, useEffect } from 'react';
import LoginForm from './components/LoginForm/LoginForm';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import { Context } from '.';
import { observer } from 'mobx-react-lite';
import BlogList from './components/BlogList/BlogList';
import BlogForm from './components/BlogForm/BlogForm';

function App() {
  const {store} = useContext(Context);
  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth();
    }
  }, []);

  if (store.isLoading) {
    return <div className='App'></div>
  }

  if (!store.isAuth) {
    return (
      <div className='App'>
        <LoginForm/>
        <RegistrationForm/>
      </div>
    )
  }

  return (
    <div className="App">
      <button onClick={() => store.logout()}>Выйти</button>
      <BlogForm/>
      <BlogList/>
    </div>
  );
}

export default observer(App);
