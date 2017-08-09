// @flow

import React, { Component } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import TagList from 'components/TagList';
import TimeAgo from 'components/TimeAgo';
import Label from 'components/Label';
import './styles.scss';

type Props = {
  question: Object,
  category: Object,
  showDetail: boolean,
};

class QuestionInfo extends Component {
  getLastAnsweredDate = (answers, createdOn) => {
    let lastDate = createdOn;
    answers.forEach((v) => {
      const a = new Date(lastDate).getTime();
      const b = new Date(v.get('createdOn')).getTime();
      if (a < b) {
        lastDate = v.get('createdOn');
      }
      return true;
    });

    return lastDate;
  }
  props: Props
  renderDetails = (message, tags) => (
    <div>
      { message &&
        <div className="row mt-md">
          <div
            className="questionInfo__message column medium-9 small-12"
            dangerouslySetInnerHTML={{ __html: message }}
          />
        </div>
      }
      <div className="questionInfo__tags row mt-md column">
        <TagList
          values={tags}
          readOnly
        />
      </div>
    </div>
  )

  render() {
    const { question, category, showDetail } = this.props;
    const avatar = question.getIn(['user', 'picture']);
    const username = question.getIn(['user', 'username']);
    const closed = question.get('closed');
    const createdOn = question.get('createdOn');
    const title = question.get('title');
    const message = question.get('message');
    const views = question.get('views');
    const answers = question.get('answers');
    const answerCount = answers.size;
    const lastDate = this.getLastAnsweredDate(answers, createdOn);
    const tags = question.get('tags');

    return (
      <div className="questionInfo">
        <div className="row">
          <div className="small-12 medium-shrink column mb-md">
            <Label
              className={classnames({ danger: closed,
                success: !closed })}
            >
              {closed ? 'Closed' : 'Open'}
            </Label>
          </div>
          <div className="column mb-sm">
            <div className="row align-middle">
              <div className="small-12 column mb-md">
                <Link
                  className="questionInfo__slugLink"
                  to={`/advice/${category.get('slug')}/${question.get('slug')}`}
                >{title}</Link>
                {showDetail && this.renderDetails(message, tags)}
              </div>
              <div className="shrink column npr mb-sm">
                <img
                  className="questionInfo__avatar"
                  src={avatar}
                  alt={username}
                />
              </div>
              <div className="shrink column mb-sm">
                <div className="questionInfo__user">{username}</div>
              </div>
              <div className="questionInfo__category shrink column mb-sm">in <Link
                className="questionInfo__actionLink"
                to={`/advice/${category.get('slug')}`}
              >{category.get('name')}</Link></div>
              <div className="shrink column mb-sm">
                <TimeAgo
                  data={lastDate}
                  prefix={answerCount > 0 ? 'answered' : 'asked'}
                />
              </div>
            </div>
          </div>
          <div className="small-12 medium-shrink column">
            <div className="row">
              <div className="shrink column fs-mn"><div className="fs-lg text-center">{ answerCount || 0 }</div>Answers</div>
              <div className="shrink column fs-mn"><div className="fs-lg text-center">{ views }</div>Views</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default QuestionInfo;
