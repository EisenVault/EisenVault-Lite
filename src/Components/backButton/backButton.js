import { useHistory } from "react-router-dom";
import React from 'react';
import './backButton.scss';

export const Item = () => {
    let history = useHistory();

    return (
        <div>
          <button onClick={() => history.goBack()} className="backButton">Back</button>
        </div>
    );
};