import React, { useContext, useEffect } from 'react';
import LoginForm from './components/LoginForm/LoginForm';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import { Context } from '.';
import { observer } from 'mobx-react-lite';
import BlogList from './components/BlogList/BlogList';
import BlogForm from './components/BlogForm/BlogForm';
import BlogService from './services/BlogService';

function App() {
  const {store, blogStore} = useContext(Context);
  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth();
      BlogService.fetchPosts(1, 20).then((posts) => {
        blogStore.setPosts(posts.data.rows)
        blogStore.setTotalCount(posts.data.count);
      });
    }

  }, [store.isAuth]);

  useEffect(() => {
    BlogService.fetchPosts(blogStore.page, blogStore.limit).then((posts) => {
      blogStore.setPosts(posts.data.rows)
      blogStore.setTotalCount(posts.data.count);
    });
  }, [blogStore.page]);

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
