import React from 'react'

export const About = ( ) => {
  return (
    <div className="about">
      <div className="about-header"><h2>Pocket Finance - Intro</h2></div>
      <div className="about-note">
        <p>Pocket Finance provides a portable snapshot of your finances: income, expenses, and assets. Features include:
          <ul>
            <li>Estimate federal and state level income tax, for either Single or Married filing status, and assuming standard deduction.</li>
            <li>Up to date stock income and asset values using end of day stock prices.</li>
            <li>Easily update income, expenses, and assets through a user-interface.</li>
          </ul>
        </p>
        <p>While the site is fully functional, the limitations of the free tiers of Heroku and the stock data APIs means that scaling users requires a paid upgrade.
          For this reason, only the Google login method works when deployed.
        </p>
      </div>  
      <div className="about-header grey"><h3>Pocket Finance - Technical Details and Credits</h3></div>
        <div className="about-note">
        <h3>Site Structure:</h3>
          <ul>
            <li>Written in Javascript, CSS, and HTML</li>
            <li>Powered by Postgres, Express, React, Redux, Node.JS and deployed on Heroku</li> 
            <li>Authentication managed by Passport and OAUTH</li>
          </ul>
        <h3>Data Sources:</h3>
        <ul>
          <li>
            <a href="https://fred.stlouisfed.org/docs/api/fred/">Fred API:</a>
            <span>macroeconomic data from the Economic Research Division of the Federal Reserve Bank of St. Louis</span>
          </li>
          <li>
            <a href="https://www.quandl.com/tools/api">Quandl API:</a>
            <span>aggregated data on the Yale US Stock Confidence Index, London Gold Price, and Schiller PE Ratio (CAPE)</span>
          </li>
          <li>
            <a href="https://marketstack.com/documentation">Marketstack API:</a>
            <span>stock price histories; their free tier is limited in API calls and frequency</span>
          </li>
          <li>
            <a href="https://www.alphavantage.co/documentation/">AlphaVantage API:</a>
            <span>stock price histories (backup for stocks that Marketstock doesn't cover); their free tier is limited in API calls and frequency</span>
          </li>
        </ul>
        <h3>Other Credits:</h3>
        <ul>
          <li>
            <a href="https://www.flaticon.com/uicons">Flat Icon:</a>
            <span>navigation bar images</span>
          </li>
          <li>
            <a href="https://favicon.io/emoji-favicons/red-envelope/">Favicon:</a>
            <span>red envelop favicon images</span>
          </li>
        </ul>
      </div>
    </div>
  )
}