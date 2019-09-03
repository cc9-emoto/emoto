import React from 'react';

const Onboarding = ({location}) => {
  return (
    <div className="onboarding">
      <h1>Onboarding</h1>
      <p>Your username is {location.search.slice(4)}</p>
    </div>
  )
}

export default Onboarding;