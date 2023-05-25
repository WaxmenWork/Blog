import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import { IPost } from '../../models/IPost'
import { Context } from '../..'
import BlogService from '../../services/BlogService'
import BlogPost from '../BlogPost/BlogPost'
import Pages from '../Pages/Pages'

const BlogList = () => {

    const {blogStore} = useContext(Context);

    return (
        <div>
          <h1>Блог</h1>
          <Pages/>
          {blogStore.posts.length === 0 ? (
            <p>Пусто</p>
          ) :
          <>
            {blogStore.posts.map(post => (
              <BlogPost key={post.id} post={post}/>
            ))}
          </>
          }
          
        </div>
      );
      
}

export default observer(BlogList)