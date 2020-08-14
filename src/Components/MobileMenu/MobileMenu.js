import React from 'react';
import './MobileMenu.css'

const DrawerToggleButton = props => (
  <button className="toggle-button" onClick={props.drawertoggleHandler}>
    <div className="toggle-button__line" />
    <div className="toggle-button__line" />
    <div className="toggle-button__line" />
  </button>
)

export default DrawerToggleButton

