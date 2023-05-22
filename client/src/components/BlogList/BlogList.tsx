import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import { IPost } from '../../models/IPost'
import { Context } from '../..'
import BlogService from '../../services/BlogService'
import BlogPost from '../BlogPost/BlogPost'

const BlogList = () => {

    const {store} = useContext(Context);
    const [posts, setPosts] = useState<IPost[]>([]);

    useEffect(() => {
        getPosts();
    }, []);

    async function getPosts() {
        try {
            const response = await BlogService.fetchPosts();
            setPosts(response.data);
        } catch (e) {
            console.log(e);
        }
    }

    if (posts.length === 0) {
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
          {posts.map(post => (
            <BlogPost key={post.id} post={post} UserId={store.user.id}/>
          ))}
        </div>
      );
      
}

export default observer(BlogList)