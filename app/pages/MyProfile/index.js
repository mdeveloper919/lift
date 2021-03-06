// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';

import ProfileContainer from 'containers/Profile';
import { requestUserDataUpdate, requestUserPhotoUpload, setProfileBreadcrumbPath, requestUser } from 'containers/App/sagas';

type Props = {
  user: Object,
  isLoading: boolean,
  error: string,
  saveUserData: Function,
  uploadPhoto: Function,
  setProfileBreadcrumbPath: Function,
  requestUser: Function,
  uploadedPhoto: string,
};

class MyProfile extends Component {
  componentWillMount() {
    this.props.requestUser();
  }
  componentDidMount() {
    const breadcrumbPath = fromJS([
      {
        link: '/me',
        title: 'My Account',
      },
      {
        link: '',
        title: 'My Profile',
      },
    ]);
    this.props.setProfileBreadcrumbPath(breadcrumbPath);
  }
  props: Props
  render() {
    const { user, isLoading, error, saveUserData, uploadPhoto, uploadedPhoto } = this.props;

    return (
      <ProfileContainer
        user={user}
        isLoading={isLoading}
        error={error}
        saveUserData={saveUserData}
        uploadPhoto={uploadPhoto}
        uploadedPhoto={uploadedPhoto}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.getIn(['app', 'user']),
  isLoading: state.getIn(['app', 'isLoading']),
  error: state.getIn(['app', 'error']),
  uploadedPhoto: state.getIn(['app', 'uploadedPhoto']),
});

const mapDispatchToProps = (dispatch) => ({
  saveUserData: (payload) => dispatch(requestUserDataUpdate(payload)),
  uploadPhoto: (payload) => dispatch(requestUserPhotoUpload(payload)),
  setProfileBreadcrumbPath: (payload) => dispatch(setProfileBreadcrumbPath(payload)),
  requestUser: () => dispatch(requestUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);
