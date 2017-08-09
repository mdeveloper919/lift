// @flow

import React, { Component } from 'react';
import Slick from 'react-slick';

import './styles.scss';

type Props = {
  instance?: Function,
}

class Carousel extends Component {
  props: Props
  instance: Object
  render() {
    const { instance, ...otherProps } = this.props;
    return (
      <Slick
        {...otherProps}
        ref={instance}
      />
    );
  }
}

export default Carousel;
