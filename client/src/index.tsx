import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Store from './store/store';
import BlogStore from './store/blog-store';
import 'bootstrap/dist/css/bootstrap.min.css';

interface State {
  store: Store,
  blogStore: BlogStore
}

const store = new Store();
const blogStore = new BlogStore();

export const Context = createContext<State>({
  store,
  blogStore
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Context.Provider value={{
    store,
    blogStore
  }}>
    <App />
  </Context.Provider>
);