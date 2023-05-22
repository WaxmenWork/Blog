import React from 'react'
import { IPost } from '../../models/IPost';
import { MEDIA_URL } from '../../http';
import styles from './BlogPost.module.css';

interface BlogPostProps {
    post: IPost;
    UserId: number;
}

const BlogPost = ({post, UserId}: BlogPostProps) => {
  return (
    <div className={styles.postItem}>
        <div>
            <h3>{post.title}</h3>
        </div>
        <div className={styles.media}>
            {post.Media.map(item => {
            if (item.type === "image") {
                return (
                    <div className={styles.imageItem} key={item.id}>
                        <img src={MEDIA_URL + item.url} alt={item.type} />
                    </div>
                );
            }
            else if (item.type === "video") {
                return (
                    <div className={styles.videoItem} key={item.id}>
                        <video controls src={MEDIA_URL + item.url}/>
                    </div>
                );
            }
            else {
                return (
                    <div key={item.id}>
                        <audio src={MEDIA_URL + item.url}/>
                    </div>
                );
            }
            })}
        </div>
        <div>
            <p>{post.message}</p>
        </div>
        <div>
            <p>{post.User.email}</p>
        </div>
        <div>
            {post.UserId === UserId ? <p>Ваш пост</p> : <p>Чужой пост</p>}
        </div>
    </div>
  )
}

export default BlogPost