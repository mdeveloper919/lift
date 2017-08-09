// @flow

import React, { Component } from 'react';
import { isMobile } from 'utils/checkMobile';

// Styles for this component are in `/styles/components/input.scss` in order for custom inputs like react-formal's `Field` to be styled properly.

type Props = {
  type?: string,
  className?: string,
  onChange?: Function,
  onKeyUp?: Function,
  onKeyDown?: Function,
  onKeyPress?: Function,
  autoFocus?: boolean,
  placeholder?: string,
  value?: string,
  name?: string,
  id?: string,
  instance?: Function,
}

class Input extends Component {
  static defaultProps = {
    type: 'text',
  }

  componentDidMount() {
    if (this.props.autoFocus && !isMobile(navigator.userAgent || navigator.vendor || window.opera)) {
      this.inputElement.focus();
    }
  }

  props: Props
  inputElement: HTMLElement
  render() {
    const { onChange, instance, ...otherProps } = this.props;
    return (
      <input
        onChange={(e) => { if (onChange) onChange(e.target.value); }}
        ref={(input) => { this.inputElement = input; if (instance) instance(input); }}
        {...otherProps}
      />
    );
  }
}

export default Input;
