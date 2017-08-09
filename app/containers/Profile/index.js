// @flow
import React, { Component } from 'react';
import Helmet from 'components/Helmet';

import ProfileEditForm from 'components/ProfileEditForm';
import ProfileInfo from 'components/ProfileInfo';

type Props = {
  user: Object,
  isLoading: boolean,
  error: string,
  saveUserData: Function,
  uploadPhoto: Function,
  uploadedPhoto: string,
}

class ProfileContainer extends Component {
  props: Props
  render() {
    const { user, isLoading, error, saveUserData, uploadPhoto, uploadedPhoto } = this.props;
    return (
      <div>
        <Helmet title="My Profile - Lift" />
        <div className="row">
          <div className="small-12 columns">
            <ProfileEditForm
              user={user}
              isLoading={isLoading}
              error={error}
              saveUserData={saveUserData}
              uploadPhoto={uploadPhoto}
              uploadedPhoto={uploadedPhoto}
            />
          </div>
          {false && <div className="small-12 medium-3 columns">
            <ProfileInfo
              user={user}
              reviewsCount={0}
              helpfulReviewsCount={0}
            />
          </div>}
        </div>
      </div>
    );
  }
}

export default ProfileContainer;
