// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import ProductReviewForm from 'containers/ReviewForm';

import {
  requestProduct,
  submitComment,
  submitReview,
  requestReview,
  completeReviewForm,
  clearReviewForm,
  reeuqstReviewPhotoUpload,
  clearReviewPhotos,
} from 'containers/Product/sagas';

type Props = {
  params: Object,
  isLoading: boolean,
  error: string,
  product: Object,
  comment: Object,
  review: Object,
  reviewData: Object,
  requestProduct: Function,
  submitComment: Function,
  submitReview: Function,
  requestReview: Function,
  currentUser: Object,
  reviewCompletion: Object,
  completeReviewForm: Function,
  clearReviewForm: Function,
  uploadPhoto: Function,
  clearReviewPhotos: Function,
  uploadedPhotos: Array<string>,
  isUploading: boolean,
};

class ProductReviewFormPage extends Component {
  props: Props
  render() {
    const {
      params,
      isLoading,
      error,
      product,
      comment,
      review,
      reviewData,
      currentUser,
      reviewCompletion,
      isUploading,
      uploadedPhotos,
    } = this.props;
    return (
      <ProductReviewForm
        category="product"
        slug={params.slug}
        reviewId={params.id}
        data={product}
        isLoading={isLoading}
        error={error}
        comment={comment}
        review={review}
        reviewData={reviewData}
        reviewCompletion={reviewCompletion}
        requestData={this.props.requestProduct}
        submitComment={this.props.submitComment}
        submitReview={this.props.submitReview}
        requestReview={this.props.requestReview}
        completeReviewForm={this.props.completeReviewForm}
        clearReviewForm={this.props.clearReviewForm}
        currentUser={currentUser}
        uploadPhoto={this.props.uploadPhoto}
        clearReviewPhotos={this.props.clearReviewPhotos}
        isUploading={isUploading}
        uploadedPhotos={uploadedPhotos}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.getIn(['app', 'user']),
  product: state.getIn(['product', 'data', 'hits', 0]),
  isLoading: state.getIn(['product', 'isLoading']),
  error: state.getIn(['product', 'error']),
  comment: state.getIn(['product', 'comment']),
  review: state.getIn(['product', 'review']),
  reviewData: state.getIn(['product', 'reviewData']),
  reviewCompletion: state.getIn(['product', 'reviewCompletion']),
  uploadedPhotos: state.getIn(['product', 'uploadedPhotos']),
  isUploading: state.getIn(['product', 'isUploading']),
});

const mapDispatchToProps = (dispatch) => ({
  requestProduct: (slug) => dispatch(requestProduct(slug)),
  submitComment: (payload, commentId) => dispatch(submitComment(payload, commentId)),
  submitReview: (payload, reviewId) => dispatch(submitReview(payload, reviewId)),
  requestReview: (id) => dispatch(requestReview(id)),
  completeReviewForm: (path, value) => dispatch(completeReviewForm(path, value)),
  clearReviewForm: () => dispatch(clearReviewForm()),
  uploadPhoto: (index, payload) => dispatch(reeuqstReviewPhotoUpload(index, payload)),
  clearReviewPhotos: () => dispatch(clearReviewPhotos()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductReviewFormPage);
