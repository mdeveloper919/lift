// @flow

import React, { Component } from 'react';
import { Link } from 'react-router';
import Button from 'components/Button';
import Icon from 'components/Icon';
import Tooltip from 'components/Tooltip';

import ReviewCount from 'components/ReviewCount';
import BusinessItemDetail from 'components/BusinessesList/BusinessItem/BusinessItemDetail';

import ChevronDown from 'images/sprite/chevron-down.svg';
import ChevronUp from 'images/sprite/chevron-up.svg';
import Active from 'images/sprite/active.svg';
import Promoted from 'images/sprite/promoted.svg';


import './styles.scss';

type Props = {
  data: Object,
  isMapView: boolean,
  onClickViewOnMap: Function,
  category: string,
};

class BusinessItem extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      isToggled: false,
    };
  }
  state: {
    isToggled: boolean,
  }

  onToggleItem = () => {
    this.setState({ isToggled: !this.state.isToggled });
  }

  props: Props
  render() {
    const { data, isMapView, category } = this.props;
    const name = data.get('name');
    const slug = data.get('slug');
    const placeholderImg = 'https://liftcannabis.ca/uploads/f75cdf8fb58061d1baf329f0f746f580.png';
    const thumbnail = data.get('thumbnail') || placeholderImg;
    return (
      <div
        id={slug}
        className="businessItem mb-xl"
      >
        <div className="row mb-lg">
          <div className="shrink column">
            <Link
              className="businessItem__titleLink"
              to={`/${category}/${slug}`}
            >
              <div
                className="businessItem__image"
                style={{ backgroundImage: `url('https://images.lift.co/resize/70x70/${thumbnail}')` }}
              >
              </div>
            </Link>
          </div>
          <div className="column text-left">
            <div className="row">
              {
                data.getIn(['features', 'promoted']) && <div className="shrink column npr mb-sm">
                  <Tooltip
                    tooltipPosition="top"
                    tooltipIndicator={false}
                    tooltipContent="Featured business"
                  ><Icon
                    glyph={Promoted}
                    size={20}
                  /></Tooltip>
                </div>
              }
              {
                !!data.get('admins').size && <div className="shrink column mb-sm">
                  <Tooltip
                    tooltipPosition="top"
                    tooltipIndicator={false}
                    tooltipContent="This business is active on Lift"
                  >
                    <Icon
                      glyph={Active}
                      size={20}
                    />
                  </Tooltip>
                </div>
              }
            </div>
            <div className="businessItem__title">
              <Link
                className="businessItem__titleLink t-capitalize mb-lg"
                to={`/${category}/${slug}`}
              >
                <h4 className="businessItem__name">{name}</h4>
              </Link>
              <Icon
                glyph={this.state.isToggled ? ChevronUp : ChevronDown}
                size={12}
                onClick={this.onToggleItem}
                className="businessItem__icon"
              />
            </div>
            <ReviewCount
              className="mb-md"
              reviewCount={data.get('reviewCount')}
              ratingsAverage={data.get('rating')}
              to={`/${category}/${slug}/reviews`}
            />
            <BusinessItemDetail
              isMapView={isMapView}
              className={(this.state.isToggled && !isMapView ? '' : 'hide')}
              data={data}
              category={category}
              onClickViewOnMap={this.props.onClickViewOnMap}
            />
            <BusinessItemDetail
              isMapView={isMapView}
              className={(this.state.isToggled && isMapView ? '' : 'hide')}
              data={data}
              category={category}
              onClickViewOnMap={this.props.onClickViewOnMap}
            />
          </div>
          {!isMapView && <div className="shrink column">
            <Link
              className="businessItem__actionLink"
              to={`/${category}/${slug}`}
            >
              <Button
                element="button"
                className="secondary"
              >View Profile</Button>
            </Link>
          </div>}
        </div>
      </div>

    );
  }
}

export default BusinessItem;
