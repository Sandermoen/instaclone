import React, { Fragment, useState } from 'react';

import MobileHeader from '../../components/Header/MobileHeader/MobileHeader';
import SearchBox from '../../components/SearchBox/SearchBox';
import TextButton from '../../components/Button/TextButton/TextButton';
import UserCard from '../../components/UserCard/UserCard';

const ExplorePage = () => {
  const [result, setResult] = useState([]);
  const [search, setSearch] = useState(false);

  return (
    <Fragment>
      <MobileHeader
        style={
          search && {
            gridTemplateColumns: 'repeat(2, 1fr) min-content',
            gridColumnGap: '2rem',
          }
        }
        show
      >
        <SearchBox
          style={{ gridColumn: `${search ? '1 / span 2' : '1 / -1'}` }}
          setResult={setResult}
          onClick={() => setSearch(true)}
        />
        {search && (
          <TextButton onClick={() => setSearch(false)} bold large>
            Cancel
          </TextButton>
        )}
      </MobileHeader>
      <div className="explore-page grid">
        {search && (
          <div className="explore-users">
            {result.map((user) => (
              <UserCard
                avatar={user.avatar}
                username={user.username}
                subText={user.fullName}
              />
            ))}
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default ExplorePage;
