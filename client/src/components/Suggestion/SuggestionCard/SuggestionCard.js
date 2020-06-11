import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';

import Avatar from '../../Avatar/Avatar';

const SuggestionCard = ({ avatar, username, fullName, posts, children }) => {
  const history = useHistory();

  return (
    <div className="suggestion-card">
      <Avatar
        onClick={() => history.push('/' + username)}
        className="avatar--large mb-sm"
        imageSrc={avatar}
      />
      <h4 className="heading-4 font-bold">{username}</h4>
      <h4 className="heading-4 color-grey font-medium">{fullName}</h4>
      <div className="suggestion-card__content">
        {posts.length > 0 ? (
          posts.map((post, idx) => (
            <figure className="suggestion-card__image-container" key={idx}>
              <img
                src={post.thumbnail}
                alt="User post"
                style={{ filter: post.filter }}
              />
            </figure>
          ))
        ) : (
          <Fragment>
            <div style={{ padding: '2rem' }}>
              <h3 className="heading-4 font-bold">No Posts</h3>
              <h4 className="heading-5 font-medium color-grey">
                This user has no posts yet, follow them to see their future
                posts.
              </h4>
            </div>
          </Fragment>
        )}
      </div>

      <div className="suggestion-card__footer">
        <h5 className="heading-5 color-grey font-medium">Random</h5>
        {children}
      </div>
    </div>
  );
};

export default SuggestionCard;
