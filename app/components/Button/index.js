// @flow

import React from 'react';
import cx from 'classnames';

import Spinner from 'components/Spinner';

import './styles.scss';

type Props = {
  element?: any,
  className?: string,
  children?: React.Element<any>,
  onClick?: Function,
  to?: string,
  type?: string,
  activeClassName?: string,
  disabled?: boolean,
  isLoading?: boolean
};

const Button = (props: Props) => {
  const { className, element = 'a', children, onClick, to, type, activeClassName, disabled, isLoading } = props;
  const mergedClassName = cx('button', className);
  const actualProps: Object = {
    className: mergedClassName,
    onClick,
    to,
    disabled
  };
  if (activeClassName) actualProps.activeClassName = activeClassName;
  return React.createElement(
    type ? 'button' : element,
    actualProps,
    <span>
      {isLoading && <Spinner className="button__spinner" />}
      {[children]}
    </span>
  );
};

export default Button;
