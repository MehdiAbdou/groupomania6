import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty, timestampParser } from '../Utils';
import { NavLink } from 'react-router-dom';
import { addPost, getPosts } from '../../actions/post.actions';

const NewPostForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [postPicture, setPostPicture] = useState(null);
  const [file, setFile] = useState();
  const userData = useSelector(state => state.userReducer);
  const errors = useSelector(state => state.errorReducer.postError);
  const dispatch = useDispatch();

  const handlePost = () => {
    if (message || postPicture) {
      const data = new FormData();
      data.append('posterId', userData._id);
      data.append('message', message);
      if (file) data.append('file', file);

      dispatch(addPost(data));
      dispatch(getPosts());
      cancelPost();
    } else {
      alert('Veuillez entrer un message');
    }
  };

  const cancelPost = () => {
    setMessage('');
    setPostPicture('');
    setFile('');
  };

  const handlePicture = e => {
    setPostPicture(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    if (!isEmpty(userData)) setIsLoading(false);
  }, [userData]);

  return (
    <div className="post-container">
      {isLoading ? (
        <i className="fas fa-spinner fa-pulse"></i>
      ) : (
        <>
          <NavLink to="/profil">
            <div className="user-info">
              <img src={userData.picture} alt="user-img" />
            </div>
          </NavLink>
          <div className="post-form">
            <textarea
              name="message"
              id="message"
              placeholder="Publiez votre humeur du jour!"
              onChange={e => setMessage(e.target.value)}
              value={message}
            />
            {message || postPicture >= 1 ? (
              <li className="card-container">
                <div className="card-left">
                  <img src={userData.picture} alt="user-pic" />
                </div>
                <div className="card-right">
                  <div className="card-hearder">
                    <div className="pseudo">
                      <h3>{userData.pseudo}</h3>
                    </div>
                    <span>{timestampParser(Date.now())}</span>
                  </div>
                  <div className="content">
                    <p>{message}</p>
                    <img src={postPicture} alt="" />
                  </div>
                </div>
              </li>
            ) : null}
            <div className="footer-form">
              <div className="icon">
                <>
                  <img src="./img/icons/picture.svg" alt="img" />
                  <input
                    aria-label="upload-picture"
                    type="file"
                    id="file-upload"
                    name="file"
                    accept=".jpg, .jpeg, .png"
                    onChange={e => handlePicture(e)}
                  />
                </>
              </div>
              {!isEmpty(errors.format) && <p>{errors.format}</p>}
              {!isEmpty(errors.maxSize) && <p>{errors.maxSize}</p>}
              <div className="btn-send">
                <button className="send" onClick={handlePost}>
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NewPostForm;
