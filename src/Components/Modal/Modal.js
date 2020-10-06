/******************************************
* File: Modal.js
* Desc: Display Modal body with backdrop when 'show' property is 'true'.
* @author: Vanshika Bhatt, 6 october 2020
********************************************/

import React from 'react'
import './Modal.scss'
import Auxiliary from '../../hoc/Auxiliary'
import Backdrop from '../Backdrop/Backdrop'

const Modal =(props)=>(
  <Auxiliary>
    <Backdrop show={props.show}/>
    <div className="Modal"
      style={{
        transform:props.show ? 'translateY(0)' : 'translateY(-100vh)',
        opacity:props.show ? '1': '0'
      }}>{props.children}</div>
  </Auxiliary>
  );

export default Modal;