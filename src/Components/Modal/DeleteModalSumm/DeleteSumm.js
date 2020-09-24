import React, { Fragment } from "react";
import "./Deletesumm.scss";

export const ForgotPassword = props => {
  return(
    <Fragment>
      <div className="modal-header">
        <h2>Forgot Password</h2>
        </div>
        <div>
          <div>
            <h3>You will recieve an email link to reset password.</h3>
           
            <div className="label-input">
            <label>URL:</label>
              <input type="text" {...props.url} id="urlFrgtPswd" required/>
                <br/>
              <label>Username:</label>
              <input type="text" {...props.forgotPswdUserName} required/>
            </div>
          </div>
        </div>

        <div id="btns">
          <button className="btn-continue-p" 
          onClick= {props.resetPassword}>
          {props.pswdloading? 
          ("Please Wait while we are sending email...") :("Email")}
            </button>
          <button onClick={props.clicked} className="btn-cancel-p">
            Cancel</button>
        </div>
    </Fragment>
  )
}

export const DeleteDepartment = (props) => {
  return(
    <Fragment>
      <div className="modal-header">
        <h2>Delete Department</h2>
        </div>
        <div>
          <div>
            <h3>Please select the department you want to delete</h3>
           
            <div className="label-input">
              <label>Departments:</label>
              <input type="text" name="name">
              </input>
              </div>
              <br></br>
              <div className="label-input">
              <label>URL:</label>
              <input type="text" name="url"></input>
              </div>
              <br></br>
              <div className="label-input">
            <label>Description:</label>
            <textarea row="8" col="60"></textarea>
            </div>
            
            <div className="label-input">
            <input type="checkbox"></input>
            <label>Please confirm whether you want to delete the department and all its contents.</label>
            </div>
          </div>
        </div>
        <div id="btns">

          <button className="btn-continue">Delete Department</button>
          <button className="btn-continue" onClick={props.deleteDept}>Delete</button>
          <button onClick={props.clicked} className="btn-cancel">Cancel</button>
        </div>
    </Fragment>
  )
}