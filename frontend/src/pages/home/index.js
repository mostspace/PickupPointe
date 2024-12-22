import React from 'react'

import { Helmet } from 'react-helmet-async';

// Sections
import { HomepageView } from 'src/sections/home/main/view';

const Homepage = () => {
  return (
    <>
      <Helmet>
        <title>Pickup Pointe</title>
      </Helmet>

      <HomepageView />
    </>
  )
}

export default Homepage