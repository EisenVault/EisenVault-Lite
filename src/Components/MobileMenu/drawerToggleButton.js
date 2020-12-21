/******************************************
* File: drawerToggleButton.js
* Desc: Display's ToggleButton when minimum width is 770px.
* @props {drawertoggleHandler},by clicking on toggle button sideDrawer will be visible.
* @author: Vanshika Bhatt, 6 october 2020
********************************************/

import React from 'react';
import './MobileMenu.scss';

export const DrawerToggleButton = props => (
  <button className="toggle-button" 
  onClick={props.drawertoggleHandler}>
    <div className="toggle-button__line" />
    <div className="toggle-button__line" />
    <div className="toggle-button__line" />
  </button>
)
