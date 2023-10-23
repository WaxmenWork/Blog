import { observer } from 'mobx-react-lite';
import React, { useContext, useRef, useState } from 'react'
import BlogService from '../../services/BlogService';
import { Context } from '../..';
import styles from './BlogForm.module.scss'

const BlogForm = () => {
    const {blogStore} = useContext(Context);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [media, setMedia] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
  
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        if (title.length < 6 || title.length > 64) {
          alert("Заголовок должен быть длинной не менее 6 и не более 64 символов");
        } else {
          await blogStore.addPost(title, message, media);
          setTitle("");
          setMessage("");
          setMedia([]);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length <= 5) {
        setMedia(Array.from(event.target.files));
      } else {
        alert("Вы можете выбрать не более 5 файлов");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    return (
      <div className={styles.blogForm}>
        <h1>Создание поста</h1>
        <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Заголовок:</label><br />
          <input
            id="title"
            type="text"
            value={title}
            onChange={event => setTitle(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="message">Сообщение:</label><br />
          <textarea
            id="message"
            value={message}
            onChange={event => setMessage(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="media">Медиа:</label><br />
          <input
            ref={fileInputRef}
            id="media"
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.gif,.mp3,.mp4"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit">Создать пост</button>
      </form>
      </div>
    );
  };
  

export default observer(BlogForm);