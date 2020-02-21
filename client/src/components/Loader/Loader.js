import React from 'react';

import { ReactComponent as LoaderSvg } from '../../assets/svg/loader.svg';

const Loader = () => (
  <div className="loader">
    <LoaderSvg className="loader__svg" />
  </div>
);

export default Loader;
