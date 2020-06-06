import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <main className="not-found-page grid">
    <div
      style={{
        gridColumn: 'center-start / center-end',
        textAlign: 'center',
        padding: '0 2rem',
      }}
    >
      <h1 className="heading-1">Sorry, this page isn't available.</h1>
      <h3 className="heading-3 font-medium">
        The link you followed may be broken, or the page may have been removed.{' '}
        <Link to="/" className="link">
          Go back to Instaclone.
        </Link>
      </h3>
    </div>
  </main>
);

export default NotFoundPage;
