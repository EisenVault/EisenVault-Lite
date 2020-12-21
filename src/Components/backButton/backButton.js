import { useHistory } from "react-router-dom";
import React from 'react';
import './backButton.scss';

/******************************************
* File: backButton.js
* Desc: To go back to the previous page.
* @author: Shayane Basu, 06 October 2020
********************************************/

export const Item = () => {
    let history = useHistory();

    return (
        <div data-test = "component-app">
          <button onClick={() => history.goBack()} 
          data-test = "back-button"
          className="backButton">Back</button>
        </div>
    );
};