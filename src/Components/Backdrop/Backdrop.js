/******************************************
* File: Backdrop.js
* Desc: background for modals,sideDrawer.
* @author: Vanshika Bhatt, 6 october 2020
********************************************/

import React from 'react';
import './Backdrop.scss';

/**
   * Display's backdrop when 'show' property is true(it means modal or sideDrawer is open).
   * @props {show},this tells whether modal or sideDrawer is open or close
   * @props {click}, by this clicking on backdrop sideDrawer will get closed.
   */
  
const Backdrop=(props)=>(
   props.show ? 
   <div className="Backdrop" onClick={props.click}/> :
   null
);

export default Backdrop;