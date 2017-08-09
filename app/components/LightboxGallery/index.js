// @flow

import React, { Component } from 'react';
import cx from 'classnames';
import { generate } from 'shortid';
import ImageLightbox from 'components/ImageLightbox';

import './styles.scss';

type Props = {
  images: List<string, Map>,
  className?: string,
};

class LightboxGallery extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      photoIndex: 0,
      isOpen: false,
    };
  }
  state: {
    photoIndex: number,
    isOpen: boolean,
  };
  props: Props
  render() {
    const { images, className } = this.props;
    const { isOpen, photoIndex } = this.state;
    const mergedClassName = cx(className, 'lightboxGallery row');
    return (
      <div className={mergedClassName}>
        {images && images.entrySeq().map(([key, image]) => (
          <div
            className="column small-4"
            key={generate()}
          >
            <img // eslint-disable-line jsx-a11y/no-static-element-interactions
              className="lightboxGallery__image"
              src={image}
              alt={image}
              onClick={() => {
                this.setState({
                  isOpen: true,
                  photoIndex: key,
                });
              }}
            />
          </div>
        ))}
        {isOpen && images &&
          <ImageLightbox
            mainSrc={images.get(photoIndex)}
            nextSrc={images.get((photoIndex + 1) % images.size)}
            prevSrc={images.get(((photoIndex + images.size) - 1) % images.size)}

            onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={() => this.setState({
              photoIndex: ((photoIndex + images.size) - 1) % images.size,
            })}
            onMoveNextRequest={() => this.setState({
              photoIndex: (photoIndex + 1) % images.size,
            })}
          />
        }
      </div>
    );
  }
}

export default LightboxGallery;
