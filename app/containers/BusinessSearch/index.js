// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, fromJS } from 'immutable';

import Helmet from 'components/Helmet';
import Breadcrumbs from 'components/Breadcrumbs';
import BusinessesList from 'components/BusinessesList';
import Preloader from 'components/Preloader';

import { requestBusinesses } from 'containers/BusinessSearch/sagas';
import BusinessFilter from 'components/BusinessFilter';

type Props = {
  category: string,
  businesses: List<*>,
  isLoading: boolean,
  filter: Object,
  requestBusinesses: Function,
  model: Object,
};

class BusinessSearchContainer extends Component {

  props: Props
  render() {
    const { category, filter, model, businesses, isLoading } = this.props;
    let helmetTitle = 'Lift';
    const breadcrumbPath = fromJS([
      {
        link: '/find',
        title: 'Find',
      },
      {
        link: '',
        title: `${category}`,
      },
    ]);
    switch (category.toLowerCase()) {
      case 'doctors':
        helmetTitle = 'Canada\'s Medical Marijuana Doctors and Clinics. - Lift';
        break;
      case 'producers':
        helmetTitle = 'Licensed Medical Marijuana Producers in Canada - Lift';
        break;
      case 'dispensaries':
        helmetTitle = 'Canada\'s Marijuana Dispensaries and Compassion Clubs. - Lift';
        break;
      default:
        helmetTitle = 'Lift';
    }
    return (
      <div>
        <Helmet title={`${helmetTitle}`} />
        <Breadcrumbs
          path={breadcrumbPath}
        />
        <div className="row column">
          <h1 className="c-secondary mb-lg t-capitalize">{category}</h1>
        </div>
        <BusinessFilter
          filter={filter}
          requestBusinesses={(path, value) => this.props.requestBusinesses(category, path, value)}
          model={model}
        />
        {isLoading ?
          <Preloader />
          :
          <BusinessesList
            data={businesses}
            province={model.get('province')}
            category={category}
          />
        }
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  filter: state.getIn(['businessSearch', props.category, 'filter']),
  businesses: state.getIn(['businessSearch', props.category, 'data', 'hits']),
  isLoading: state.getIn(['businessSearch', props.category, 'isLoading']),
  model: state.getIn(['businessSearch', props.category, 'filter', 'model']),
});

const mapDispatchToProps = (dispatch) => ({
  requestBusinesses: (category, path, value) => dispatch(requestBusinesses(category, path, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BusinessSearchContainer);
