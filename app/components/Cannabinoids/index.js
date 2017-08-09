// @flow

import React from 'react';
import cx from 'classnames';

import formatDecimal from 'utils/decimal';

type Props = {
  className?: string,
  thc?: string,
  cbd?: string,
}

const Cannabinoids = ({ className, thc, cbd }: Props) => {
  if (!thc && !cbd) return null;
  const mergedClassName = cx(className, 'row fs-md align-center cannabinoidsContainer');
  return (
    <div className={mergedClassName}>
      {thc && <div className="shrink column t-nowrap"><strong>THC</strong> {formatDecimal(thc)}</div>}
      {cbd && <div className="shrink column t-nowrap"><strong>CBD</strong> {formatDecimal(cbd)}</div>}
    </div>
  );
};

export default Cannabinoids;
