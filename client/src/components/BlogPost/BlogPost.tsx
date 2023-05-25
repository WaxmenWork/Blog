import React, { ButtonHTMLAttributes, DetailedHTMLProps, MouseEventHandler, useContext, useEffect, useState } from 'react'
import { IPost } from '../../models/IPost';
import { MEDIA_URL } from '../../http';
import styles from './BlogPost.module.css';
import { Button, Col, Container, Modal, Row } from 'react-bootstrap';
import { Context } from '../..';
import PostEditForm from '../PostEditForm/PostEditForm';
import Pages from '../Pages/Pages';

interface BlogPostProps {
    post: IPost;
}

const BlogPost = ({post}: BlogPostProps) => {

    const {store, blogStore} = useContext(Context);
    const [isEditing, setIsEditing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [mediaIdToDelete, setMediaIdToDelete] = useState<number | null>(null);
    const postCreatedAt = (new Date(post.createdAt)).toUTCString();
    const postUpdatedAt = (new Date(post.updatedAt)).toUTCString();

    useEffect(() => {
        if (isEditing && blogStore.editingPostId !== post.id) {
            setIsEditing(false);
        }
    }, [blogStore.editingPostId]);

    const editPost = () => {
        setIsEditing(true);
        blogStore.setEditingPostId(post.id);
    }

    const handleDeleteMedia = (mediaId: number) => {
        setMediaIdToDelete(mediaId);
        setShowModal(true);
      };
    
      const handleConfirmDelete = () => {
        if (mediaIdToDelete) {
          blogStore.deleteMedia(mediaIdToDelete);
        }
        setShowModal(false);
        setMediaIdToDelete(null);
      };

  return (
    <div className={styles.postItem}>
        <div>
            <h3>{post.title}</h3>
        </div>
        <hr />
        {post.Media.length > 0 && (
        <Container>
            <Row className={styles.imageRow}>
            {post.Media.filter((item) => item.type === 'image').map((item) => (
                <Col key={item.id} xs={4}>
                    <div className={styles.imageItem}>
                        {isEditing && (
                            <span
                                className={styles.deleteMedia}
                                onClick={() => handleDeleteMedia(item.id)}
                            >
                                X
                            </span>
                        )}
                        <img src={MEDIA_URL + item.url} alt={item.type} />
                    </div>
                </Col>
            ))}
            </Row>
            <Row className={styles.videoRow}>
            {post.Media.filter((item) => item.type === 'video').map((item) => (
                <Col key={item.id} xs={6}>
                    <div className={styles.videoItem}>
                        {isEditing && (
                            <span
                                className={styles.deleteMedia}
                                onClick={() => handleDeleteMedia(item.id)}
                            >
                                X
                            </span>
                        )}
                        <video controls src={MEDIA_URL + item.url} />
                    </div>
                </Col>
            ))}
            </Row>
            <Row className={styles.audioRow}>
            {post.Media.filter((item) => item.type === 'audio').map((item) => (
                <Col key={item.id}>
                    <div className={styles.audioItem}>
                        {isEditing && (
                            <span
                                className={styles.deleteMedia}
                                onClick={() => handleDeleteMedia(item.id)}
                            >
                                X
                            </span>
                        )}
                        <audio controls src={MEDIA_URL + item.url} />
                    </div>
                </Col>
            ))}
            </Row>
        </Container>
        )}
        <Container>
            <Col>
                <p className={styles.postMessage}>{post.message}</p>
            </Col>
        </Container>
        <Container>
            <Row>
                <Col>
                    <p>{post.User.email}</p>
                </Col>
                <span>Создан: {postCreatedAt}</span><br/>
                <span>Изменён: {postUpdatedAt}</span>
            </Row>
        </Container>
        <hr />
        <Container>
            {post.UserId === store.user.id ? (
                <Col>
                    <button onClick={() => blogStore.deletePost(post.id)}>Удалить</button>
                    {isEditing ?
                    (<PostEditForm post={post}/>) :
                    <button onClick={editPost}>Редактировать</button>
                    }
                </Col>
            ) : <p>Чужой пост</p>}
        </Container>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>Удаление элемента</Modal.Header>
            <Modal.Body>Вы уверены, что хотите удалить этот элемент?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Отмена
                </Button>
                <Button variant="primary" onClick={handleConfirmDelete}>
                    ОК
                </Button>
            </Modal.Footer>
        </Modal>
    </div>
  )
}

export default BlogPost