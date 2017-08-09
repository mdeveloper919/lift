// @flow

import React, { Component } from 'react';
import Form, { Field } from 'react-formal';
import yup from 'yup';
import moment from 'moment';
import numeral from 'numeral';
import { generate } from 'shortid';

import Button from 'components/Button';
import RequireAuth from 'components/RequireAuth';
import ValidationMessage from 'components/ValidationMessage';
import TextAreaField from 'components/TextAreaField';
import StarRating from 'components/StarRating';
import EffectList from 'components/EffectList';
import TagList from 'components/TagList';
import RadioButtonGroup from 'components/RadioButtonGroup';

import ImageRadioGroup from 'components/ImageRadioGroup';
import DatePicker from 'components/DatePicker';
import Dropzone from 'components/Dropzone';
import ProgressBar from 'components/ProgressBar';

import Icon from 'components/Icon';
import ChevronDown from 'images/sprite/chevron-down.svg';
import ChevronUp from 'images/sprite/chevron-up.svg';

import IconVape from 'images/sprite/vape.svg';
import IconJoint from 'images/sprite/joint.svg';
import IconBong from 'images/sprite/bong.svg';
import IconEdibles from 'images/sprite/edibles.svg';
import IconMorning from 'images/sprite/morning.svg';
import IconDaytime from 'images/sprite/daytime.svg';
import IconEvening from 'images/sprite/evening.svg';

import './styles.scss';

const methodOfConsumptionOptions = [
  {
    title: 'Vaporizer',
    value: 'vaporizer',
    icon: IconVape,
  },
  {
    title: 'Joint',
    value: 'joint',
    icon: IconJoint,
  },
  {
    title: 'Bong',
    value: 'bong',
    icon: IconBong,
  },
  {
    title: 'Edibles',
    value: 'edibles',
    icon: IconEdibles,
  },
];

const timeOfConsumptionOptions = [
  {
    title: 'Morning',
    value: 'morning',
    icon: IconMorning,
  },
  {
    title: 'Daytime',
    value: 'daytime',
    icon: IconDaytime,
  },
  {
    title: 'Evening',
    value: 'evening',
    icon: IconEvening,
  },
];

const defaultToggleValue = {
  review: true,
  batchInformation: true,
  prescribedFor: true,
  symptomsHelped: true,
  positiveEffects: true,
  negativeEffects: true,
  flavours: true,
  methodOfConsumption: true,
  timeOfConsumption: true,
  durationOfEffect: true,
  photos: true,
};

const schema = yup.object({
  rating: yup
    .number()
    .min(0.5, 'You must include an Overall Rating')
    .max(5)
    .required(),
  title: yup
    .string()
    .required('You must include a Review Title'),
  message: yup
    .string()
    .min(50, 'Reviews must be at least 50 characters.  Please tell us more...')
    .required(),
  wouldPurchaseAgain: yup
    .boolean(),
  batch: yup
    .string()
    .nullable(),
  purchasedOn: yup
    .date()
    .nullable(),
  purchasedPrice: yup
    .number()
    .nullable(),
  thc: yup
    .number()
    .nullable(),
  cbd: yup
    .number()
    .nullable(),
  prescribedFor: yup
    .array()
    .of(yup
      .string()
      .required()
    ),
  symptomsHelped: yup
    .array()
    .of(yup
      .object({
        name: yup
          .string()
          .required(),
        value: yup
          .number()
          .min(1)
          .max(10),
      })
    ),
  flavours: yup
    .array()
    .of(yup
      .string()
      .required()
    ),
  positiveEffects: yup
    .array()
    .of(yup
      .object({
        name: yup
          .string()
          .required(),
        value: yup
          .number()
          .min(1)
          .max(10),
      })
    ),
  negativeEffects: yup
    .array()
    .of(yup
      .object({
        name: yup
          .string()
          .required(),
        value: yup
          .number()
          .min(1)
          .max(10),
      })
    ),
  methodOfConsumption: yup
    .mixed()
    .oneOf([
      null,
      'vaporizer',
      'joint',
      'bong',
      'edibles',
    ])
    .nullable(),
  timeOfConsumption: yup
    .mixed()
    .oneOf([
      null,
      'morning',
      'daytime',
      'evening',
    ])
    .nullable(),
  durationOfEffect: yup
    .number()
    .nullable(),
});

type Props = {
  submitReview: Function,
  isLoading: boolean,
  reviewId: string,
  error: string,
  productId: string,
  reviewData: Object,
  currentUser: Object,
  completeReviewForm: Function,
  clearReviewForm: Function,
  uploadPhoto: Function,
  clearReviewPhotos: Function,
};

class CannabisProductReviewForm extends Component {
  constructor(props: Object) {
    super(props);
    const tempData = localStorage.getItem(props.productId);
    if (tempData) {
      this.state = {
        model: JSON.parse(tempData),
        isToggled: defaultToggleValue,
      };
      this.submitReview(JSON.parse(tempData));
      localStorage.removeItem(props.productId);
    } else {
      const { currentUser } = props;
      const prescribedFor = currentUser && currentUser.get('knownConditions') ? currentUser.get('knownConditions').toJS() : [];
      this.state = {
        model: {
          rating: 0,
          title: '',
          message: '',
          wouldPurchaseAgain: true,
          batch: '',
          purchasedOn: null,
          purchasedPrice: null,
          thc: null,
          cbd: null,
          prescribedFor,
          symptomsHelped: [],
          flavours: [],
          positiveEffects: [],
          negativeEffects: [],
          methodOfConsumption: null,
          timeOfConsumption: null,
          durationOfEffect: null,
          photos: [],
        },
        uploadedFiles: [],
        isToggled: defaultToggleValue,
        uploadingFuncs: [],
      };
    }
    this.dropzoneRef = null;
  }

  state: {
    model: Object,
    uploadedFiles: Array<string>,
    isToggled: Object,
    uploadingFuncs: Array<Function>,
  };


  componentWillMount() {
    const { reviewData, reviewId } = this.props;
    const prescribedFor = reviewData.getIn(['data', 'prescribedFor']) ? reviewData.getIn(['data', 'prescribedFor']).toJS() : [];
    const symptomsHelped = reviewData.getIn(['data', 'symptomsHelped']) ? reviewData.getIn(['data', 'symptomsHelped']).toJS() : [];
    const flavours = reviewData.getIn(['data', 'flavours']) ? reviewData.getIn(['data', 'flavours']).toJS() : [];
    const positiveEffects = reviewData.getIn(['data', 'positiveEffects']) ? reviewData.getIn(['data', 'positiveEffects']).toJS() : [];
    const negativeEffects = reviewData.getIn(['data', 'negativeEffects']) ? reviewData.getIn(['data', 'negativeEffects']).toJS() : [];

    if (reviewId && reviewData.get('data')) {
      this.setState({
        model: {
          rating: reviewData.getIn(['data', 'rating']),
          title: reviewData.getIn(['data', 'title']),
          message: reviewData.getIn(['data', 'message']),
          wouldPurchaseAgain: reviewData.getIn(['data', 'wouldPurchaseAgain']),
          batch: reviewData.getIn(['data', 'batch']),
          purchasedOn: moment(reviewData.getIn(['data', 'purchasedOn'])).toDate(),
          purchasedPrice: reviewData.getIn(['data', 'purchasedPrice']),
          thc: reviewData.getIn(['data', 'thc']),
          cbd: reviewData.getIn(['data', 'cbd']),
          prescribedFor,
          symptomsHelped,
          flavours,
          positiveEffects,
          negativeEffects,
          methodOfConsumption: reviewData.getIn(['data', 'methodOfConsumption']),
          timeOfConsumption: reviewData.getIn(['data', 'timeOfConsumption']),
          durationOfEffect: reviewData.getIn(['data', 'durationOfEffect']),
          photos: reviewData.getIn(['data', 'photos']),
        },
        isToggled: defaultToggleValue,
        uploadedFiles: [],
        uploadingFuncs: [],
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
          rating: 0,
          title: '',
          message: '',
          wouldPurchaseAgain: true,
          batch: '',
          purchasedOn: null,
          purchasedPrice: null,
          thc: null,
          cbd: null,
          prescribedFor: [],
          symptomsHelped: [],
          flavours: [],
          positiveEffects: [],
          negativeEffects: [],
          methodOfConsumption: null,
          timeOfConsumption: null,
          durationOfEffect: null,
          photos: [],
        },
        isToggled: defaultToggleValue,
        uploadedFiles: [],
        uploadingFuncs: [],
      });
    }

    if (newProps.isUploading === false && newProps.uploadedPhotos) {
      const uploadedPhotos = newProps.uploadedPhotos.toJS();
      this.state.model.photos = uploadedPhotos;
      for (let i = 0; i < uploadedPhotos.length; i += 1) {
        if (uploadedPhotos[i]) {
          this.state.uploadedFiles[i].progress = 100;
          clearInterval(this.state.uploadingFuncs[i]);
        }
      }
    }
  }
  componentWillUnmount() {
    this.props.clearReviewForm();
  }
  onChange = (model: Object) => {
    this.setState({ model });
  }

  onChangeRate = (rate: Number) => {
    const { model } = this.state;
    model.rating = rate;
    this.props.completeReviewForm(['rating'], !!rate);
    this.onChange(model);
  }

  onChangePurchase = (value?: Boolean) => {
    const { model } = this.state;
    model.wouldPurchaseAgain = value;
    this.onChange(model);
  }

  onChangeMethodOfConsumption = (value?: string) => {
    const { model } = this.state;
    model.methodOfConsumption = value;
    this.onChange(model);
  }

  onChangeTimeOfConsumption = (value?: string) => {
    const { model } = this.state;
    model.timeOfConsumption = value;
    this.onChange(model);
  }

  onChangeSymptomsHelped = (values: Array<Object>) => {
    this.state.model.symptomsHelped = values;
  }

  onRedirect = () => {
    const { productId, reviewId } = this.props;
    const postData = this.state.model;
    postData.product = productId;
    postData.__t = 'CannabisProductReview'; // eslint-disable-line no-underscore-dangle
    postData.id = reviewId;
    postData.url = window.location.pathname;
    localStorage.setItem(productId, JSON.stringify(postData));
  }

  onToggleItem = (name: string) => {
    const { isToggled } = this.state;
    isToggled[name] = !isToggled[name];
    this.setState({ isToggled });
  }

  onDrop = (accepted) => {
    this.state.uploadedFiles = accepted;
    this.state.uploadingFuncs = [];
    this.props.clearReviewPhotos();
    for (let index = 0; index < accepted.length; index += 1) {
      this.props.uploadPhoto(index, accepted[index]);
      this.state.uploadedFiles[index].progress = 0;
      this.state.uploadingFuncs.push(setInterval((funcIndex) => {
        const progress = this.state.uploadedFiles[funcIndex].progress;
        if (progress >= 95) {
          this.state.uploadedFiles[funcIndex].progress = progress + ((98 - progress) / 2);
        } else {
          this.state.uploadedFiles[funcIndex].progress = progress + 5;
        }
        this.forceUpdate();
      }, 80, index));
    }
    this.forceUpdate();
  }

  submitReview = (data: Object) => {
    const { productId, submitReview, reviewData, reviewId, currentUser } = this.props;
    const postData = data;
    postData.product = productId;
    postData.__t = 'CannabisProductReview'; // eslint-disable-line no-underscore-dangle
    postData.id = reviewId;
    postData.url = window.location.pathname;

    postData.photos = this.state.model.photos;
    if (currentUser) {
      submitReview(postData, reviewData.getIn(['data', 'id']));
    }
  }

  props: Props
  render() {
    const { isLoading, error, currentUser } = this.props;
    const arrowSize = 16;
    const minMessageLength = 50;
    const secondaryMessagePrompt = 'Please elaborate on your experience: include how you felt before, during, and after.  Describe your purchasing experience and anything else relevant to other cannabis product consumers.';
    const positiveEffectsPrompt = 'Creative, energetic, euphoric, etc...';
    const negativeEffectsPrompt = 'Nausea, anxiety, paranoia, etc...';
    const flavoursPrompt = 'Citrus, earthy, fruity, etc...';
    const prescribedForPrompt = 'Cancer, Glaucoma, HIV/AIDS, etc...';
    const symptomsHelpedPrompt = 'Anxiety, insomnia, pain, etc...';
    return (
      <Form
        schema={schema}
        value={this.state.model}
        onChange={this.onChange}
        onSubmit={this.submitReview}
        className="cannabisProductReviewForm"
      >
        <div className="row mb-mx">
          <div className="column pt-md">
            <h3 className="t-capitalize">Create Review (earn up to 300pts)</h3>
          </div>
        </div>
        <div className="row mb-md">
          <div className="column">
            <label htmlFor="title">Overall Rating (10pts)</label>
            <StarRating
              initialRate={this.state.model.rating}
              readonly={false}
              size={55}
              onChange={(rate) => { this.onChangeRate(rate); }}
              id="rating"
            />
            <ValidationMessage for="rating" />
          </div>
        </div>
        <div className="row">
          <div className="column">
            <label htmlFor="title">Review Title (20pts)</label>
            <Field
              className="accent cannabisProductReviewForm__title"
              name="title"
              id="title"
              type="text"
              onChange={(value) => this.props.completeReviewForm(['title'], !!value)}
              onFocus={() => this.setState({ showSecondaryTitle: true })}
              onBlur={() => this.setState({ showSecondaryTitle: false })}
            />
            {this.state.showSecondaryTitle ? <div className="fs-md">Create a short, descriptive and accurate title for your review</div> : null }
            {!this.state.showSecondaryTitle && <ValidationMessage for="title" />}
          </div>
        </div>
        <div className="row mb-mx">
          <div className="column pt-md">
            <label htmlFor="message">Review Comments (40pts)</label>
            <TextAreaField
              className="accent cannabisProductReviewForm__message"
              name="message"
              id="message"
              onChange={(value) => this.props.completeReviewForm(['message'], !!value)}
              onFocus={() => this.setState({ showSecondaryMessage: true })}
              onBlur={() => this.setState({ showSecondaryMessage: false })}
            />
            {this.state.showSecondaryMessage &&
              <div className="fs-md">
                {secondaryMessagePrompt}
                {this.state.model.message.length < minMessageLength && <span className="fs-md cannabisProductReviewForm__messageLength">&nbsp;{this.state.model.message.length} of {minMessageLength} required characters, tell us more...</span>}
              </div>
            }
            {!this.state.showSecondaryMessage && <ValidationMessage for="message" />}
          </div>
        </div>
        <div className="row mb-mx">
          <div className="column">
            <label htmlFor="wouldPurchaseAgain">Would you purchase this product again? (10pts)</label>
            <RadioButtonGroup
              id="wouldPurchaseAgain"
              name="wouldPurchaseAgain"
              className="expanded"
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
              onChange={this.onChangePurchase}
              selectedButton={'Yes'}
            />
          </div>
        </div>

        <div className="row mb-mx">
          <div className="column bt-light-gray pt-md">
            <a // eslint-disable-line jsx-a11y/no-static-element-interactions
              className="fs-mx t-capitalize cannabisProductReviewForm__toggleHeader"
              onClick={() => this.onToggleItem('batchInformation')}
            >Batch Information</a>
          </div>
          <div className="shrink column bt-light-gray pt-md">
            <span className="cannabisProductReviewForm__toggleLabel">50pts</span>
            <Icon
              glyph={this.state.isToggled.batchInformation ? ChevronUp : ChevronDown}
              size={arrowSize}
              onClick={() => this.onToggleItem('batchInformation')}
              className="cannabisProductReviewForm__toggleIcon"
            />
          </div>
        </div>

        {this.state.isToggled.batchInformation &&
          <div className="row mb-mx">
            <div className="columns small-12">
              <label htmlFor="batch">Batch or Lot (20pts)</label>
              <Field
                className="accent"
                name="batch"
                id="batch"
                type="text"
              />
              <ValidationMessage for="batch" />
            </div>
            <div className="columns small-12">
              <label htmlFor="purchasedOn">Date Purchased On (10pts)</label>
              <DatePicker
                value={this.state.model.purchasedOn}
                yearCounts={5}
                onChange={(value) => this.setState({
                  model: {
                    ...this.state.model,
                    purchasedOn: value,
                  },
                })}
              />
              <ValidationMessage for="purchasedOn" />
            </div>
            <div className="columns small-12 medium-4">
              <label htmlFor="purchasedPrice">Price Per Gram (10pts)</label>
              <Field
                className="accent"
                name="purchasedPrice"
                id="purchasedPrice"
                type="text"
              />
              <ValidationMessage
                for="purchasedPrice"
                customError="Please type a number instead"
              />
            </div>
            <div className="columns small-12 medium-4">
              <label htmlFor="thc">thc% (10pts)</label>
              <Field
                className="accent"
                name="thc"
                id="thc"
                type="text"
              />
              <ValidationMessage
                for="thc"
                customError="Please type a number instead"
              />
            </div>
            <div className="columns small-12 medium-4">
              <label htmlFor="cbd">cbd% (10pts)</label>
              <Field
                className="accent"
                name="cbd"
                id="cbd"
                type="text"
              />
              <ValidationMessage
                for="cbd"
                customError="Please type a number instead"
              />
            </div>
          </div>
        }

        <div className="row mb-mx">
          <div className="column bt-light-gray pt-md">
            <a // eslint-disable-line jsx-a11y/no-static-element-interactions
              className="fs-mx t-capitalize cannabisProductReviewForm__toggleHeader"
              onClick={() => this.onToggleItem('prescribedFor')}
            >Conditions You Suffer From</a>
            {this.state.isToggled.prescribedFor && <div className="fs-md">{prescribedForPrompt}</div>}
          </div>
          <div className="shrink column bt-light-gray pt-md">
            <span className="cannabisProductReviewForm__toggleLabel">20pts</span>
            <Icon
              glyph={this.state.isToggled.prescribedFor ? ChevronUp : ChevronDown}
              size={arrowSize}
              onClick={() => this.onToggleItem('prescribedFor')}
              className="cannabisProductReviewForm__toggleIcon"
            />
          </div>
        </div>

        {this.state.isToggled.prescribedFor &&
          <div>
            <TagList
              values={this.state.model.prescribedFor}
              inputPlaceholder="Type a condition here"
              className="mb-mx"
            />
            <ValidationMessage for="prescribedFor" />
          </div>
        }

        <div className="row mb-mx">
          <div className="column bt-light-gray pt-md">
            <a // eslint-disable-line jsx-a11y/no-static-element-interactions
              className="fs-mx t-capitalize cannabisProductReviewForm__toggleHeader"
              onClick={() => this.onToggleItem('symptomsHelped')}
            >Symptoms Helped</a>
            {this.state.isToggled.symptomsHelped && <div className="fs-md">{symptomsHelpedPrompt}</div>}
          </div>
          <div className="shrink column bt-light-gray pt-md">
            <span className="cannabisProductReviewForm__toggleLabel">20pts</span>
            <Icon
              glyph={this.state.isToggled.symptomsHelped ? ChevronUp : ChevronDown}
              size={arrowSize}
              onClick={() => this.onToggleItem('symptomsHelped')}
              className="cannabisProductReviewForm__toggleIcon"
            />
          </div>
        </div>

        {this.state.isToggled.symptomsHelped &&
          <div>
            <EffectList
              values={this.state.model.symptomsHelped}
              inputPlaceholder="Type a symptom here"
              className="mb-mx"
            />
            <ValidationMessage for="symptomsHelped" />
          </div>
        }

        <div className="row mb-mx">
          <div className="column bt-light-gray pt-md">
            <a // eslint-disable-line jsx-a11y/no-static-element-interactions
              className="fs-mx t-capitalize cannabisProductReviewForm__toggleHeader"
              onClick={() => this.onToggleItem('positiveEffects')}
            >Positive Effects</a>
            {this.state.isToggled.positiveEffects && <div className="fs-md">{positiveEffectsPrompt}</div>}
          </div>
          <div className="shrink column bt-light-gray pt-md">
            <span className="cannabisProductReviewForm__toggleLabel">20pts</span>
            <Icon
              glyph={this.state.isToggled.positiveEffects ? ChevronUp : ChevronDown}
              size={arrowSize}
              onClick={() => this.onToggleItem('positiveEffects')}
              className="cannabisProductReviewForm__toggleIcon"
            />
          </div>
        </div>

        {this.state.isToggled.positiveEffects &&
          <div>
            <EffectList
              values={this.state.model.positiveEffects}
              inputPlaceholder="Type a positive effect here"
              className="mb-mx"
            />
            <ValidationMessage for="positiveEffects" />
          </div>
        }

        <div className="row mb-mx">
          <div className="column bt-light-gray pt-md">
            <a // eslint-disable-line jsx-a11y/no-static-element-interactions
              className="fs-mx t-capitalize cannabisProductReviewForm__toggleHeader"
              onClick={() => this.onToggleItem('negativeEffects')}
            >Negative Effects</a>
            {this.state.isToggled.negativeEffects && <div className="fs-md">{negativeEffectsPrompt}</div>}
          </div>
          <div className="shrink column bt-light-gray pt-md">
            <span className="cannabisProductReviewForm__toggleLabel">20pts</span>
            <Icon
              glyph={this.state.isToggled.negativeEffects ? ChevronUp : ChevronDown}
              size={arrowSize}
              onClick={() => this.onToggleItem('negativeEffects')}
              className="cannabisProductReviewForm__toggleIcon"
            />
          </div>
        </div>

        {this.state.isToggled.negativeEffects &&
          <div>
            <EffectList
              values={this.state.model.negativeEffects}
              inputPlaceholder="Type a negative effect here"
              className="mb-mx"
            />
            <ValidationMessage for="negativeEffects" />
          </div>
        }

        <div className="row mb-mx">
          <div className="column bt-light-gray pt-md">
            <a // eslint-disable-line jsx-a11y/no-static-element-interactions
              className="fs-mx t-capitalize cannabisProductReviewForm__toggleHeader"
              onClick={() => this.onToggleItem('flavours')}
            >Flavours</a>
            {this.state.isToggled.flavours && <div className="fs-md">{flavoursPrompt}</div>}
          </div>
          <div className="shrink column bt-light-gray pt-md">
            <span className="cannabisProductReviewForm__toggleLabel">20pts</span>
            <Icon
              glyph={this.state.isToggled.flavours ? ChevronUp : ChevronDown}
              size={arrowSize}
              onClick={() => this.onToggleItem('flavours')}
              className="cannabisProductReviewForm__toggleIcon"
            />
          </div>
        </div>

        {this.state.isToggled.flavours &&
          <div>
            <TagList
              values={this.state.model.flavours}
              inputPlaceholder="Type a flavour here"
              className="mb-mx"
            />
            <ValidationMessage for="flavours" />
          </div>
        }

        <div className="row mb-mx">
          <div className="column bt-light-gray pt-md">
            <a // eslint-disable-line jsx-a11y/no-static-element-interactions
              className="fs-mx t-capitalize cannabisProductReviewForm__toggleHeader"
              onClick={() => this.onToggleItem('methodOfConsumption')}
            >Method of Consumption</a>
          </div>
          <div className="shrink column bt-light-gray pt-md">
            <span className="cannabisProductReviewForm__toggleLabel">20pts</span>
            <Icon
              glyph={this.state.isToggled.methodOfConsumption ? ChevronUp : ChevronDown}
              size={arrowSize}
              onClick={() => this.onToggleItem('methodOfConsumption')}
              className="cannabisProductReviewForm__toggleIcon"
            />
          </div>
        </div>

        {this.state.isToggled.methodOfConsumption &&
          <div>
            <ImageRadioGroup
              name="methodOfConsumption"
              itemClassName="column small-6 medium-3"
              className="row mb-mx"
              value={this.state.model.methodOfConsumption}
              options={methodOfConsumptionOptions}
              onChange={this.onChangeMethodOfConsumption}
            />
            <ValidationMessage for="methodOfConsumption" />
          </div>
        }

        <div className="row mb-mx">
          <div className="column bt-light-gray pt-md">
            <a // eslint-disable-line jsx-a11y/no-static-element-interactions
              onClick={() => this.onToggleItem('timeOfConsumption')}
              className="fs-mx t-capitalize cannabisProductReviewForm__toggleHeader"
            >Time of Day Consumed</a>
          </div>
          <div className="shrink column bt-light-gray pt-md">
            <span className="cannabisProductReviewForm__toggleLabel">20pts</span>
            <Icon
              glyph={this.state.isToggled.timeOfConsumption ? ChevronUp : ChevronDown}
              size={arrowSize}
              onClick={() => this.onToggleItem('timeOfConsumption')}
              className="cannabisProductReviewForm__toggleIcon"
            />
          </div>
        </div>

        {this.state.isToggled.timeOfConsumption &&
          <div>
            <ImageRadioGroup
              name="timeOfConsumption"
              itemClassName="column small-6 medium-4"
              className="row mb-mx"
              value={this.state.model.timeOfConsumption}
              options={timeOfConsumptionOptions}
              onChange={this.onChangeTimeOfConsumption}
            />
            <ValidationMessage for="timeOfConsumption" />
          </div>
        }

        <div className="row mb-mx">
          <div className="column bt-light-gray pt-md">
            <a // eslint-disable-line jsx-a11y/no-static-element-interactions
              onClick={() => this.onToggleItem('durationOfEffect')}
              className="fs-mx t-capitalize cannabisProductReviewForm__toggleHeader"
            >Hours of Effectiveness</a>
          </div>
          <div className="shrink column bt-light-gray pt-md">
            <span className="cannabisProductReviewForm__toggleLabel">20pts</span>
            <Icon
              glyph={this.state.isToggled.durationOfEffect ? ChevronUp : ChevronDown}
              size={arrowSize}
              onClick={() => this.onToggleItem('durationOfEffect')}
              className="cannabisProductReviewForm__toggleIcon"
            />
          </div>
        </div>

        {this.state.isToggled.durationOfEffect &&
          <div className="row mb-mx">
            <div className="column">
              <Field
                name="durationOfEffect"
                type="select"
                className="accent cannabisProductReviewForm__select"
              >
                <option value={null}>Select duration...</option>
                <option value={0.5}>0.5</option>
                <option value={1}>1</option>
                <option value={1.5}>1.5</option>
                <option value={2}>2</option>
                <option value={2.5}>2.5</option>
                <option value={3}>3</option>
                <option value={3.5}>3.5</option>
                <option value={4}>4</option>
                <option value={4.5}>4.5</option>
                <option value={5}>5</option>
                <option value={5.5}>5.5</option>
                <option value={6}>6</option>
              </Field>
              <ValidationMessage for="durationOfEffect" />
            </div>
          </div>
        }

        <div className="row mb-mx">
          <div className="column bt-light-gray pt-md">
            <a // eslint-disable-line jsx-a11y/no-static-element-interactions
              onClick={() => this.onToggleItem('photos')}
              className="fs-mx t-capitalize cannabisProductReviewForm__toggleHeader"
            >Photos</a>
          </div>
          <div className="shrink column bt-light-gray pt-md">
            <span className="cannabisProductReviewForm__toggleLabel">20pts</span>
            <Icon
              glyph={this.state.isToggled.photos ? ChevronUp : ChevronDown}
              size={arrowSize}
              onClick={() => this.onToggleItem('photos')}
              className="cannabisProductReviewForm__toggleIcon"
            />
          </div>
        </div>

        {this.state.isToggled.photos &&
          <div className="row mb-mx">
            <div className="column small-12 mb-md">
              <Dropzone
                className="cannabisProductReviewForm__dropzone"
                ref={(node) => { this.dropzoneRef = node; }}
                accept="image/*"
                onDrop={this.onDrop}
              >
                <div className="text-center">
                  <Button
                    type="button"
                    className="cannabisProductReviewForm__dropzoneButton button primary"
                  >
                    Choose Files
                  </Button>
                  <div className="cannabisProductReviewForm__dropzoneLabel">or drag’n’drop here</div>
                </div>

              </Dropzone>
            </div>
            {this.state.uploadedFiles && this.state.uploadedFiles.length > 0 &&
              <div className="column small-12">
                <div
                  className="row align-middle mb-sm fs-tn t-uppercase"
                >
                  <div
                    className="column small-3"
                  >
                    <strong>NAME</strong>
                  </div>
                  <div
                    className="column small-2"
                  >
                    <strong>SIZE</strong>
                  </div>
                  <div
                    className="column small-5"
                  >
                    <strong>PROGRESS</strong>
                  </div>
                  <div
                    className="column small-2"
                  >
                    <strong>STATUS</strong>
                  </div>
                </div>
                {this.state.uploadedFiles.map((item) => (
                  <div
                    className="row align-middle cannabisProductReviewForm__photoRowLabel"
                    key={generate()}
                  >
                    <div
                      className="column small-3"
                    >
                      {item.name}
                    </div>
                    <div
                      className="column small-2"
                    >
                      {numeral(item.size).format('0.00 b')}
                    </div>
                    <div
                      className="column small-5"
                    >
                      <ProgressBar
                        value={item.progress}
                        maxValue={100}
                        width={5}
                        trailWidth={5}
                        initialAnimate={false}
                      />
                    </div>
                    <div
                      className="column small-2"
                    >
                      {item.progress === 100 ? 'Complete' : 'Uploading'}
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
        }
        <div className="row">
          <div className="small-12 column mb-md bt-light-gray pt-md">
            { currentUser ?
              <Button
                className="button secondary large expanded"
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
                <Button className="button secondary large expanded">Submit</Button>
              </RequireAuth>
            }
            <ValidationMessage for="rating" />
            <ValidationMessage for="title" />
            <ValidationMessage for="message" />
          </div>
        </div>
        <div className="small-12 column text-center c-danger">{error}</div>
      </Form>
    );
  }
}

export default CannabisProductReviewForm;
