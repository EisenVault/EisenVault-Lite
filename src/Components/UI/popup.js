/******************************************
* File: popup.js
* Desc: popup summary of Trash page
* @author: Vanshika Bhatt, 6 october 2020
********************************************/

import React from "react";
import Popup from "reactjs-popup";
import "./popup.scss";
  
/**
   * arrow function to show popup's.
   * @param {close} ,used to close popup when API operation is completed successfully.
   * @props {defdelete}, delete all files by clicking on DELETE button.
   * @props {defrestore}, restore all the files by clicking on RESTORE button.
   * @props {deleted}, delete selected files by clicking on DELETE button.
   * @props {restored}, restore selected files by clicking on RESTORE button.
   */
  //
 
  const NestedToolTip = (props) => (
    <Popup 
      trigger= {<label id="label">Action </label>}
      position="bottom left"
      closeOnDocumentClick>{close=>(
        <div><div>
        <Popup
          trigger={<option id="option"> Delete All </option>} modal
          position="bottom left">
            <span> <h2 className="Dh2">Delete Documents</h2>
            <p className="content Dh3">
              Are you sure you want to delete All files?
              <br /> NOTE:The deleted file will be stored in trash for 30 days.</p>
            <button
              className="btn-cancel btn-c" 
              onClick={()=>{close()}}>CANCEL</button>
            <button className="btn-continue btn-d" onClick={async()=>{await props.defdelete(close)}}>DELETE</button></span>
            </Popup></div>
        <div>
         <Popup
          trigger={<option id="option">Delete Selected </option>} modal
          position="top right">
          <span> <h2 className="Dh2">Delete Documents</h2>
            <p className="content Dh3">
              Are you sure you want to Delete selected files?
               <br /> NOTE:The deleted file will be stored in trash for 30 days.</p>
            <button
              className="btn-cancel btn-c" 
              onClick={()=>{close()}}>CANCEL</button>
            <button className="btn-continue btn-d" onClick={async ()=>{await props.deleted(close)}}>DELETE</button> </span>
        </Popup></div>
        <div>
        <Popup
          trigger={<option id="option"> Restore All </option>} modal
          position="top right"
           >{close=>(
          <span> <h2 className="Dh2">Restore Documents</h2>
            <p className="content Dh3">
              Are you sure you want to Restore All files?</p>
            <button
              className="btn-cancel btn-c" 
              onClick={()=>{close()}}>CANCEL</button>
            <button className="btn-continue btn-d" onClick={async()=>{await props.defrestore(close)}}>RESTORE</button> </span>
           )}</Popup></div>
          <div>
         <Popup
          trigger={<option id="option"> Restore Selected </option>} modal
          position="top right">
          <span> <h2 className="Dh2">Restore Documents</h2>
            <p className="content Dh3">
              Are you sure you want to Restore selected files?</p>
            <button
              className="btn-cancel btn-c" 
              onClick={()=>{close()}}
            >CANCEL</button>
            <button className="btn-continue btn-d" onClick={async ()=>{await props.restored(close)}}>RESTORE</button> </span>
          </Popup></div> </div> )}      
    </Popup>
  );
  export default NestedToolTip;