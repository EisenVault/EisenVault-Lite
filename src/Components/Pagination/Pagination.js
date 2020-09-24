import React, { useState } from "react";
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