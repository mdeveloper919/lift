// @flow

import React from 'react';
import { Link, browserHistory } from 'react-router';
import numeral from 'numeral';

import Tooltip from 'components/Tooltip';
import ReviewCount from 'components/ReviewCount';
import Cannabinoids from 'components/Cannabinoids';
import Icon from 'components/Icon';
import ButtonGroup, { ButtonGroupItem } from 'components/ButtonGroup';

import IconIndica from 'images/sprite/Icon-Indica.svg';
import IconHybrid from 'images/sprite/Icon-Hybrid.svg';
import IconOil from 'images/sprite/Icon-Oil.svg';
import IconSativa from 'images/sprite/Icon-Sativa.svg';

import './styles.scss';

const categoryIcons = {
  indica: IconIndica,
  hybrid: IconHybrid,
  oil: IconOil,
  sativa: IconSativa,
};

type Props = {
  data: Object,
};

const ProductCard = (props: Props) => {
  const { data } = props;
  const producer = data.getIn(['business', 'name']);
  const productCategory = data.get('__t');
  let category = data.get('category');
  if (productCategory === 'Oil') {
    category = 'oil';
  }
  const categoryIcon = categoryIcons[category];
  const baseUrl = `/${data.get('__t') && data.get('__t') ? data.get('__t').toLowerCase() : 'product'}s`;
  const slug = data.get('slug');
  const changeRouteWithSlug = () => { browserHistory.push(`${baseUrl}/${slug}`); };
  return (
    <div className="productCard">
      <Link
        className="productCard__link"
        to={`${baseUrl}/${slug}`}
      >
        {category ?
          <Tooltip
            tooltipPosition="top"
            tooltipIndicator={false}
            tooltipContent={category}
          >
            <div
              className="productCard__image"
              style={{ backgroundImage: `url('https://images.lift.co/resize/78x78/${data.get('thumbnail')}')` }}
            >
              {categoryIcon &&
                <Icon
                  glyph={categoryIcon}
                  size={30}
                  className="productCard__categoryIcon"
                />
              }
            </div>
          </Tooltip>
        :
          <div
            className="productCard__image"
            style={{ backgroundImage: `url('https://images.lift.co/resize/78x78/${data.get('thumbnail')}')` }}
          />
        }
        <h4 className="mb-tn fs-xl">{data.get('name')}</h4>
      </Link>
      {producer && <div className="productCard__producer">{producer}</div>}
      <Cannabinoids
        thc={data.get('thc')}
        cbd={data.get('cbd')}
      />
      <ReviewCount
        className="align-center mb-mn"
        reviewCount={data.get('reviews').size}
        ratingsAverage={data.get('rating')}
        to={`${baseUrl}/${slug}/reviews`}
      />
      <div className="row">
        <div className="column text-center">
          <ButtonGroup className="productCard__buttonGroup secondary">
            <ButtonGroupItem
              onClick={() => changeRouteWithSlug()}
              className="productCard__buttonGroupItem"
            >${numeral(data.getIn(['variants', '0', 'price']) / 100).format('0.00')}</ButtonGroupItem>
            <ButtonGroupItem
              onClick={() => changeRouteWithSlug()}
              className="productCard__buttonGroupItem"
            >View</ButtonGroupItem>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
