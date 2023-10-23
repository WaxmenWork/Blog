import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import { IPost } from '../../models/IPost'
import { Context } from '../..'
import BlogService from '../../services/BlogService'
import BlogPost from '../BlogPost/BlogPost'
import Pages from '../Pages/Pages'
import styles from './BlogList.module.scss'
import BlogForm from '../BlogForm/BlogForm'

const BlogList = () => {

    const {blogStore} = useContext(Context);

    return (
        <div className={styles.blogList}>
          <h1>Блог</h1>
          <BlogForm/>
          <Pages/>
          {blogStore.posts.length === 0 ? (
            <p>Пусто</p>
          ) :
          <div className={styles.container}>
            {blogStore.posts.map(post => (
              <BlogPost key={post.id} post={post}/>
            ))}
          </div>
          }
          
        </div>
      );
      
}

export default observer(BlogList)