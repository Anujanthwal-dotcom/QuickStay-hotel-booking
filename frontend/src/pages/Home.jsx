import React from 'react'
import Hero from '../components/Hero'
import FeaturedDestinations from '../components/FeaturedDestinations'
import ExclusiveOffers from '../components/ExclusiveOffers'
import Testimonial from '../components/Testimonial'
import Newsletter from '../components/Newsletter'

const Home = () => {
  return (
    <>
        <Hero/>
        <FeaturedDestinations/> 
        <ExclusiveOffers/>
        <Testimonial/>
        <Newsletter/>
        
    </>
  )
}

export default Home