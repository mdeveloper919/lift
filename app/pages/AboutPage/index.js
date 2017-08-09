// @flow

import React from 'react';
import Helmet from 'components/Helmet';
import { fromJS } from 'immutable';

import Breadcrumbs from 'components/Breadcrumbs';
import BorderedTitle from 'components/BorderedTitle';
import Team from 'components/Team';
import PageBanner from 'components/PageBanner';
import Button from 'components/Button';
import Panel from 'components/Panel';

import AboutBanner from 'images/banners/about.jpg';
import './styles.scss';

const AboutPage = () => {
  const breadcrumbPath = fromJS([
    {
      link: '',
      title: 'About',
    },
  ]);
  return (
    <div className="aboutPage">
      <Helmet title="About Us - Lift" />
      <Breadcrumbs path={breadcrumbPath} />
      <PageBanner
        bg={AboutBanner}
        title="Say hello to Lift"
        titleLarge
        subtitle="Our team is at the heart of what we do"
      />
      <div className="row mb-xxl">
        <div className="small-12 medium-6 column">
          <BorderedTitle>Our Story</BorderedTitle>
          <p>When Canada ushered in a new medical cannabis program in 2013, few resources were available for patients looking to access it for the first time. Though the program demonstrated Canada’s global leadership on the issue of medical cannabis, questions remained regarding how the new system worked and who the federally-licensed cannabis producers were. The absence of clear information, coupled with decades of stigmatization about the plant itself, led to even more confusion amongst Canadians who were simply looking to explore and understand cannabis’ medicinal potential.</p>
          <p>It was against this backdrop that Lift was created. With the goal of inspiring patient confidence by equipping them with reliable and easily accessible information, Lift set out on a mission to empower everyone to make better informed decision around cannabis. Though in its earliest stages Lift resembled a simple educational website, it immediately resonated with Canadians looking for a credible and trustworthy source of cannabis information and news.</p>
          <p>Since then Lift has grown rapidly to host major industry events, offer breaking news and analysis and pioneering some of the industry’s most innovative products. It has emerged as the industry’s voice in Canada’s and one of the world’s most innovative cannabis companies. An expansive technology and media brand covering every facet of the cannabis industry - both in-person and online - Lift has become the meeting place for cannabis.</p>
        </div>
        <div className="small-12 medium-5 medium-offset-1 column">
          <h4 className="aboutPage__mission">Empowering everyone to make better informed decisions about cannabis.</h4>
        </div>
      </div>
      <Team />
      <div className="row column">
        <Panel dark>
          <div className="row">
            <div className="small-12 large-shrink column">
              <h3>Want to chat? We’re easy to get a hold of.</h3>
            </div>
            <div className="shrink column">
              <Button
                className="secondary semiSpacious"
                to="/contact"
              >Contact us</Button></div>
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default AboutPage;
