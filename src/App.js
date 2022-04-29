import 'regenerator-runtime/runtime'
import React, { useState, useEffect } from 'react'
import './global.css'
import hero from './assets/hero.png'
import Header from './Components/Header'
import Projects from './Components/Projects'
import Create from './Components/CreateCampaign'

import getConfig from './config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

export default function App() {


  return (
    // use React Fragment, <>, to avoid wrapping elements in unnecessary divs
    <>
     <div className="container">
      <Header />
      <div className="hero">
        <div className="hero-text">
          <h1>
            <span style={{color:"#fdcf0b"}}>Bring</span> creative projects to life with your financial support.
          </h1>
          <p>Creative work shows us what's possible. Help fund it here.</p>
          <a href="#projects"><button>Donate to project</button></a>
          <a href="#create-campaign"><button>Create campaign</button></a>
        </div>
        <img src={hero} alt="hero" />
      </div>
     </div>
      <Projects />
      <Create />
     <footer>
       <p>Created with ❤️ by <a href="https://www.twitter.com/tjelailah">@tjelailah</a>.</p>
     </footer>
    </>
  )
}