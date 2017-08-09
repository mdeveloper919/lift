// @flow

import React, { Component } from 'react';
import Form, { Field } from 'react-formal';
import yup from 'yup';
import cx from 'classnames';

import Button from 'components/Button';
import RequireAuth from 'components/RequireAuth';
import RadioGroup from 'components/RadioGroup';
import ValidationMessage from 'components/ValidationMessage';
import TextAreaField from 'components/TextAreaField';
import StarRating from 'components/StarRating';

import './styles.scss';

const schema = yup.object({
  experience: yup
    .object({
      price: yup
        .number()
        .min(0.5, 'must be rated.')
        .max(5),
      speedOfDelivery: yup
        .number()
        .min(0.5, 'must be rated.')
        .max(5),
      orderingProcess: yup
        .number()
        .min(0.5, 'must be rated.')
        .max(5),
      helpfulness: yup
        .number()
        .min(0.5, 'must be rated.')
        .max(5),
    }),
  title: yup
    .string()
    .required()
    .max(150, 'maximum title length is 150 characters'),
  message: yup
    .string()
    .required()
    .min(50, 'minimum review length is 50 characters'),
  wouldPurchaseAgain: yup
    .boolean()
    .required(),
});

type Props = {
  category: string,
  submitReview: Function,
  isLoading: boolean,
  reviewId: string,
  businessId: string,
  error: string,
  slug: string,
  reviewData: Object,
  currentUser: Object,
  completeReviewForm: Function,
  clearReviewForm: Function,
};

class BusinessReviewForm extends Component {
  constructor(props: Object) {
    super(props);
    const tempData = localStorage.getItem(props.businessId);
    if (tempData) {
      this.state = {
        model: JSON.parse(tempData),
      };
      this.submitReview(JSON.parse(tempData));
      localStorage.removeItem(props.businessId);
    } else {
      this.state = {
        model: {
          experience: {
            price: 0,
            speedOfDelivery: 0,
            orderingProcess: 0,
            helpfulness: 0,
          },
          title: '',
          message: '',
          wouldPurchaseAgain: true,
        },
        showSecondaryTitle: false,
      };
    }
  }

  state: {
    model: Object,
    showSecondaryTitle: boolean,
  };


  componentWillMount() {
    const { reviewData, reviewId } = this.props;
    if (reviewId && reviewData.get('data')) {
      this.setState({
        model: {
          experience: {
            price: reviewData.getIn(['data', 'experience', 'price']),
            speedOfDelivery: reviewData.getIn(['data', 'experience', 'speedOfDelivery']),
            orderingProcess: reviewData.getIn(['data', 'experience', 'orderingProcess']),
            helpfulness: reviewData.getIn(['data', 'experience', 'helpfulness']),
          },
          title: reviewData.getIn(['data', 'title']),
          message: reviewData.getIn(['data', 'message']),
          wouldPurchaseAgain: reviewData.getIn(['data', 'wouldPurchaseAgain']),
        },
        showSecondaryTitle: false,
      });
    }
  }
  componentDidMount() {
    const { reviewData, reviewId } = this.props;
    if (reviewId && reviewData.get('data')) {
      this.props.completeReviewForm(['rating'], true);
      this.props.completeReviewForm(['title'], true);
      this.props.completeReviewForm(['message'], true);
    }
  }
  componentWillReceiveProps(newProps: Object) {
    const { reviewId } = this.props;
    if (newProps.review &&
      newProps.review.get('isLoading') === false &&
      newProps.review.get('error') !== '' &&
      !reviewId) {
      this.setState({
        model: {
          experience: {
            price: 0,
            speedOfDelivery: 0,
            orderingProcess: 0,
            helpfulness: 0,
          },
          title: '',
          message: '',
          wouldPurchaseAgain: true,
        },
        showSecondaryTitle: false,
      });
    }
  }
  componentWillUnmount() {
    this.props.clearReviewForm();
  }
  onChange = (model: Object) => {
    this.setState({ model });
  }

  onChangeRate = (rate: Number, type: string) => {
    const { model } = this.state;
    model.experience[type] = rate;
    this.props.completeReviewForm(['rating'], !!rate);
    this.onChange(model);
  }

  onChangePurchase = (value?: Boolean) => {
    const { model } = this.state;
    model.wouldPurchaseAgain = value;
    this.onChange(model);
  }

  onRedirect = () => {
    const { slug, businessId } = this.props;
    const postData = this.state.model;
    postData.business = businessId;
    postData.slug = slug;
    postData.url = window.location.pathname;
    localStorage.setItem(businessId, JSON.stringify(postData));
  }

  submitReview = (data: Object) => {
    const { slug, submitReview, reviewData, businessId, currentUser } = this.props;
    const postData = data;
    postData.business = businessId;
    postData.slug = slug;
    postData.url = window.location.pathname;
    if (currentUser) {
      submitReview(postData, reviewData.getIn(['data', 'id']));
    }
  }

  props: Props
  render() {
    const { isLoading, error, category, currentUser } = this.props;
    const starSize = 55;
    return (
      <Form
        schema={schema}
        value={this.state.model}
        onChange={this.onChange}
        onSubmit={this.submitReview}
        className="businessReviewForm"
      >
        <div className="row mb-mx">
          <div className="column">
            <div className="fs-mx t-capitalize">Review {category}</div>
          </div>
        </div>
        <div className="row mb-md">
          <div className="column">
            <label htmlFor="title">Customer Service</label>
            <StarRating
              initialRate={this.state.model.experience.helpfulness}
              readonly={false}
              size={starSize}
              onChange={(rate) => { this.onChangeRate(rate, 'helpfulness'); }}
              id="experience_helpfulness"
            />
            <ValidationMessage for="experience.helpfulness" />
          </div>
        </div>
        <div className="row mb-md">
          <div className="column">
            <label htmlFor="title">Price</label>
            <StarRating
              initialRate={this.state.model.experience.price}
              readonly={false}
              size={starSize}
              onChange={(rate) => { this.onChangeRate(rate, 'price'); }}
              id="experience_price"
            />
            <ValidationMessage for="experience.price" />
          </div>
        </div>
        <div className="row mb-md">
          <div className="column">
            <label htmlFor="title">Ordering Process</label>
            <StarRating
              initialRate={this.state.model.experience.orderingProcess}
              readonly={false}
              size={starSize}
              onChange={(rate) => { this.onChangeRate(rate, 'orderingProcess'); }}
              id="experience_orderingProcess"
            />
            <ValidationMessage for="experience.orderingProcess" />
          </div>
        </div>
        <div className="row mb-md">
          <div className="column">
            <label htmlFor="title">Delivery Speed</label>
            <StarRating
              initialRate={this.state.model.experience.speedOfDelivery}
              readonly={false}
              size={starSize}
              onChange={(rate) => { this.onChangeRate(rate, 'speedOfDelivery'); }}
              id="experience_speedOfDelivery"
            />
            <ValidationMessage for="experience.speedOfDelivery" />
          </div>
        </div>
        <div className="row mb-mx">
          <div className="column">
            <label htmlFor="title">Review Title</label>
            <Field
              className="accent"
              name="title"
              id="title"
              type="text"
              onChange={(value) => this.props.completeReviewForm(['title'], !!value)}
              onFocus={() => this.setState({ showSecondaryTitle: true })}
              onBlur={() => this.setState({ showSecondaryTitle: false })}
            />
            {
              this.state.showSecondaryTitle ?
                <div className="fs-md">A short summary of your review <span className={cx({ 'c-danger': this.state.model.title.length > 150 })}>{this.state.model.title.length}</span> /150 characters</div> :
                <ValidationMessage for="title" />
            }
          </div>
        </div>
        <div className="row mb-mx">
          <div className="column">
            <label htmlFor="message">Review Message</label>
            <TextAreaField
              className="accent"
              name="message"
              id="message"
              onChange={(value) => this.props.completeReviewForm(['message'], !!value)}
            />
            <ValidationMessage for="message" />
          </div>
        </div>
        <div className="row mb-mx">
          <div className="column">
            <label htmlFor="wouldPurchaseAgain">Would you purchase from this {category} again?</label>
            <RadioGroup
              name="wouldPurchaseAgain"
              itemClassName="mr-md d-ib"
              options={[
                {
                  label: 'Yes',
                  value: true,
                },
                {
                  label: 'No',
                  value: false,
                },
              ]}
              value={this.state.model.wouldPurchaseAgain}
              onChange={this.onChangePurchase}
            />
          </div>
        </div>
        <div className="row">
          <div className="small-12 column mb-md">
            { currentUser ?
              <Button
                className="button secondary"
                type="submit"
                element={Form.Button}
                isLoading={isLoading}
              >Submit</Button>
              :
              <RequireAuth
                toDo="create review"
                onClickLogin={this.onRedirect}
                onClickRegister={this.onRedirect}
              >
                <Button className="button secondary">Submit</Button>
              </RequireAuth>
            }
          </div>
        </div>
        <div className="small-12 column text-center c-danger">{error}</div>
      </Form>
    );
  }
}

export default BusinessReviewForm;
