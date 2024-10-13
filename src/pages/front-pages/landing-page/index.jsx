'use client'

// React Imports
import { useEffect } from 'react'
import BlankLayout from '../../../@core/layouts/BlankLayout'

// Component Imports
import HeroSection from './HeroSection'
import UsefulFeature from './UsefulFeature'
import CustomerReviews from './CustomerReviews'
import OurTeam from './OurTeam'
import Pricing from './Pricing'
import ProductStat from './ProductStat'
import Faqs from './Faqs'
import GetStarted from './GetStarted'
import ContactUs from './ContactUs'


const LandingPageWrapper = ({ mode }) => {


  return (
    <>
      <HeroSection mode={mode} />
      <UsefulFeature />
      {/* <CustomerReviews /> */}
      {/* <OurTeam /> */}
      <Pricing />
      <ProductStat />
      <Faqs />
      <GetStarted />
      <ContactUs />
    </>
  )
}

LandingPageWrapper.getLayout = function getLayout(page) {
  return <BlankLayout>{page}</BlankLayout>;
};

export default LandingPageWrapper
