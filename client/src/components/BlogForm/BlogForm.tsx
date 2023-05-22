import { observer } from 'mobx-react-lite';
import React, { useRef, useState } from 'react'
import BlogService from '../../services/BlogService';

const BlogForm = () => {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [media, setMedia] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
  
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        await BlogService.addPost(title, message, media);
        setTitle("");
        setMessage("");
        setMedia([]);
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
        <button type="submit">Создать пост</button>
      </form>
    );
  };
  

export default observer(BlogForm);