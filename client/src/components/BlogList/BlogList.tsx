import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import { IPost } from '../../models/IPost'
import { Context } from '../..'
import BlogService from '../../services/BlogService'
import BlogPost from '../BlogPost/BlogPost'
import Pages from '../Pages/Pages'

const BlogList = () => {

    const {blogStore} = useContext(Context);

    if (blogStore.posts.length === 0) {
        return (
            <div>
                <h1>Блог</h1>
                <p>Пусто</p>
            </div>
        )
    }

    return (
        <div>
          <h1>Блог</h1>
          <Pages/>
          {blogStore.posts.map(post => (
            <BlogPost key={post.id} post={post}/>
          ))}
        </div>
      );
      
}

export default observer(BlogList)