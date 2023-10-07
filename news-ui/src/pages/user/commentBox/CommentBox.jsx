import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CommentBox.css';

const CommentList = ({ data, authors }) => {
  console.log(data);
  return (
    <div className='comment-list'>
      {data.comments.map((comment, i) => (
        <div className='comment-node' author={authors[i]} key={comment.id}>
          <div className='print-author'>{authors[i] + ' - '}</div>
          {comment.content}
        </div>
      ))}
    </div>
  );
};

const CommentForm = ({ newsId, onCommentSubmit }) => {
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const content = text.trim();

    if (!content) {
      return;
    }

    try {
      const commentResponse = await axios.post('/api/v1/comments', { content }, {
        params: { newsId },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const newComment = commentResponse.data;
      onCommentSubmit(newComment);
      setText('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <form className='comment-form' onSubmit={handleSubmit}>
      <input
        type='text'
        placeholder='Comment'
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input type='submit' value='Post' disabled={!text.trim()} />
    </form>
  );
};

const CommentBox = ({ comments, newsId }) => {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    setAuthors(comments.username);
  }, [comments]);

  return (
    <div className='comment-box'>
      <h1 className='h1'>Comments</h1>
      <CommentList data={comments} authors={authors} />
      <CommentForm onCommentSubmit={(comment) => setAuthors([...authors, comment.username])} newsId={newsId} />
    </div>
  );
};

export default CommentBox;