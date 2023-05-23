import { observer } from 'mobx-react-lite';
import React, { useContext, useRef, useState } from 'react'
import BlogService from '../../services/BlogService';
import { Context } from '../..';
import { IPost } from '../../models/IPost';

interface PostEditFormProps {
    post: IPost;
}

const PostEditForm = ({post}: PostEditFormProps) => {
    const {blogStore} = useContext(Context);
    const [title, setTitle] = useState(post.title);
    const [message, setMessage] = useState(post.message);
    const [media, setMedia] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
  
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        if (title.length < 6 || title.length > 64) {
          alert("Заголовок должен быть длинной не менее 6 и не более 64 символов");
        } else {
          await blogStore.updatePost(title, message, media, post.id);
          setTitle("");
          setMessage("");
          setMedia([]);
          blogStore.setEditingPostId(-1);
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length + post.Media.length <= 5) {
        setMedia(Array.from(event.target.files));
      } else {
        alert("Пост может содержать не более пяти файлов");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Заголовок:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={event => setTitle(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="message">Сообщение:</label>
          <textarea
            id="message"
            value={message}
            onChange={event => setMessage(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="media">Медиа:</label>
          <input
            ref={fileInputRef}
            id="media"
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.gif,.mp3,.mp4"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit">Сохранить изменения</button>
      </form>
    );
  };
  

export default observer(PostEditForm);