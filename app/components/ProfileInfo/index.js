// @flow
import React from 'react';
import moment from 'moment';

import Icon from 'components/Icon';

import IconReview from 'images/sprite/review.svg';
import IconReputation from 'images/sprite/reputation.svg';
import IconReward from 'images/sprite/reward.svg';
import IconSignUp from 'images/sprite/sign-up.svg';

import './styles.scss';

type Props = {
  user: Object,
  reviewsCount: number,
  helpfulReviewsCount: number,
};
const ProfileInfo = ({ user, reviewsCount, helpfulReviewsCount }: Props) => (
  <div className="profileInfo row align-middle">
    <div className="small-12 column">
      <div className="profileInfo__merit row">
        {reviewsCount !== null && <div className="profileInfo__meritItem column small-3">
          <Icon
            glyph={IconReview}
            size={40}
          />
          <div className="mr-md hide-for-small-only">
            &nbsp;
          </div>
          <div><strong>{reviewsCount}</strong></div>
          <div className="hide-for-small-only">&nbsp;</div>
          <div>reviews</div>
        </div>}
        <div className="profileInfo__meritItem column small-3">
          <Icon
            glyph={IconReputation}
            size={40}
          />
          <div className="mr-md hide-for-small-only">
            &nbsp;
          </div>
          <div><strong>{user && user.get('reputation')}</strong></div>
          <div className="hide-for-small-only">&nbsp;</div>
          <div>reputation</div>
        </div>
        {helpfulReviewsCount !== null && <div className="profileInfo__meritItem column small-3">
          <Icon
            glyph={IconReward}
            size={40}
          />
          <div className="mr-md hide-for-small-only">
            &nbsp;
          </div>
          <div><strong>{helpfulReviewsCount}</strong></div>
          <div className="hide-for-small-only">&nbsp;</div>
          <div>helpful reviews</div>
        </div>}
        <div className="profileInfo__meritItem column small-3">
          <Icon
            glyph={IconSignUp}
            size={40}
          />
          <div className="mr-md hide-for-small-only">
            &nbsp;
          </div>
          <div>Joined</div>
          <div className="hide-for-small-only">&nbsp;</div>
          <div><strong>{user && moment(user.get('joindate')).format('MMM D, YYYY')}</strong></div>
        </div>
      </div>
    </div>
  </div>
);

export default ProfileInfo;
