/******************************************
* File: Pagination.js
* Desc: Display pagination at the bottom of the pages.
* @props {handlePrev},gives previous items on prev button click.
* @props {handleNext},gives next items on next button click.
* @author: Vanshika Bhatt and Shrishti Raghav, 6 october 2020
********************************************/
import React from "react";
import "./stylePagination.scss";

const Pagination = (props) => {
  return (
    <nav>
        <ul className='pagination'>
        <button onClick={props.handlePrev} id="myprevBtn">
          Prev
        </button>
        <button onClick={props.handleNext} id="myBtn">
          Next
        </button>
        </ul>
    </nav>
  )
} 

export default Pagination;