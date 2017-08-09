// @flow

import React, { Component } from 'react';
import cx from 'classnames';

import Input from 'components/Input';
import Button from 'components/Button';
import Icon from 'components/Icon';

import MarkerIcon from 'images/sprite/map-marker.svg';
import SearchIcon from 'images/sprite/search.svg';
import './styles.scss';

type Props = {
  onChange?: Function,
  onSubmit?: Function,
  defaultValue?: string,
  className?: string,
  location?: string,
  placeholder?: string,
}

class SearchField extends Component {
  props: Props
  input: Object
  render() {
    const { onSubmit, className, location, placeholder, ...otherProps } = this.props;
    const mergedClassName = cx('searchField', className);
    const refinedPlaceholder = placeholder || 'Search';
    return (
      <div className={mergedClassName}>
        <Input
          className="searchField__input"
          placeholder={refinedPlaceholder}
          instance={(input) => (this.input = input)}
          autoFocus
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              if (onSubmit) onSubmit(this.input.value);
            }
          }}
          {...otherProps}
        />
        {location && <div className="searchField__location">
          <Icon
            className="searchField__locationIcon"
            glyph={MarkerIcon}
            size={14}
          />
          <span className="searchField__locationText hide-for-small-only">in {location}</span>
        </div>}
        <Button
          className="searchField__button secondary"
          element="button"
          onClick={() => { if (onSubmit) onSubmit(this.input.value); }}
        >
          <Icon
            className="searchField__icon"
            glyph={SearchIcon}
            size={14}
          />
        </Button>
      </div>
    );
  }
}

export default SearchField;
