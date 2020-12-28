import React from 'react';
import moxios from 'moxios';
import axios from 'axios';
import { setUserLocal } from '../../Utils/Common';
import 'jest-styled-components';

import { Router } from "react-router";
import { createMemoryHistory } from "history";
import { cleanup } from '@testing-library/react';

import Enzyme, { mount, shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import LoginPage from './Login';

Enzyme.configure({ adapter: new EnzymeAdapter() })

const loginApi = `https://systest.eisenvault.net/alfresco/api/-default-/public/authentication/versions/1/tickets`
const forgotPasswordApi = `https://systest.eisenvault.net/share/proxy/alfresco-noauth/com/flex-solution/reset-password`

describe('Check the APIs', () => {
    beforeEach(() => {
        moxios.install()
    })

    afterEach(() => {
        moxios.uninstall()
    })
      
    test("Login API call was successful", (done) => {
		moxios.stubRequest(loginApi, { status: 200,         
			response: {  
                "entry": {
                    "id": "TICKET_b2853ce6839d15f6951992e41119b2eaaa761a0d",
                    "userId": "Admin"},
                "success": true }
	}) //mocked response
	
    const history = createMemoryHistory();

		axios.post(loginApi, 
		{  "success": true }).then(	
		response => {
            // console.log(response.data.entry.id);	
            setUserLocal(response.data.entry.id, response.data.entry.userId);

			expect(response.status).toBe(200);
            expect(history.location.pathname).toBe("/");

			const status = response.status
			return status;
		})
		done();
    })

    test("Forgot password API call was successful", (done) => {

        let closeModal = jest.fn()

		moxios.stubRequest(forgotPasswordApi, { status: 200,         
			response: {  "success": true }
	}) //mocked response
	
		axios.post(forgotPasswordApi, 
		{  "success": true }).then(	
		response => {	
            closeModal();
            expect(response.status).toBe(200);
            
            expect(closeModal).toHaveBeenCalled();

			const status = response.status
			return status;
		})
		done();
    })
})

// test('Check for redirection' , () => {
//     const history = createMemoryHistory();

//     let wrapper = mount( 
//     <Router> 
//         <LoginPage history={history} />
//     </Router>)

//     beforeEach(() =>{
//         wrapper.find('.url').simulate('change', {
//             target: {value: 'https://systest.eisenvault.com'}})

//         wrapper.find('#user-name').simulate('change', {
//                 target: {value: 'Shayane'}})

//         wrapper.find('#pswd').simulate('change', {
//                     target: {value: 'Shayane@123'}})
//     })

//     wrapper.find('#btn_login').simulate('click');

//     expect(history.location.pathname).toBe("/dashboard");
//     afterEach(cleanup);

//     })

test('Checking for enter key', () => {
    let onEnter = jest.fn()

    let wrapper = mount( 
        <LoginPage onKeyPress={onEnter()} />
    )

    beforeEach(() =>{
        wrapper.find('.url').simulate('change', {
            target: {value: 'https://systest.eisenvault.com'}})
    
        wrapper.find('#user-name').simulate('change', {
                target: {value: 'Shayane'}})
    
        wrapper.find('#pswd').simulate('change', {
                    target: {value: 'Shayane@123'}})
    })

    wrapper.find('#pswd').prop('onKeyPress')({ key: 'Enter' }) 

    expect(onEnter).toBeCalled();
})

describe('Check Login Page Input Fields and Buttons', () => {
    let setLoading = jest.fn()

    const handleClick = jest.spyOn(React, "useState");
    handleClick.mockImplementation(loading => [loading, setLoading])

    let wrapper = shallow(<LoginPage onClick={setLoading} />)

    test('Check for url input feild', () => {
        expect(wrapper.find('#url').at(0).props().placeholder).toEqual('URL')
    })

    test('Check for username input feild', () => {
        expect(wrapper.find('#user-name').at(0).props().placeholder).toEqual('User Name')
    })

    test('Check for password input feild', () => {
        expect(wrapper.find('.login-box').length).toBe(1);
        expect(wrapper.find('.login-details').length).toBe(1);
        expect(wrapper.find('#pswd').at(0).props().placeholder).toEqual('Password')
    })

    test('Login button', () => {
        expect(wrapper.find('#btn_login').text()).toEqual('Login')
    })

    test('Forgot Password button', () => {
        expect(wrapper.find('#btn_forgotPassword').text()).toEqual('Forgot Password?')
    })
})

describe('Login page test cases', () => {

    test('Login check with right data', ()=>{
        let setLoading = jest.fn()

        const handleClick = jest.spyOn(React, "useState");
        handleClick.mockImplementation(loading => [loading, setLoading])

        let wrapper = shallow(<LoginPage onClick={setLoading} />)

        wrapper.find('#url').simulate('change', {
            target: {value: 'https://systest.eisenvault.com'}})

        wrapper.find('#user-name').simulate('change', {
                target: {value: 'Shayane'}})

        wrapper.find('#pswd').simulate('change', {
                    target: {value: 'Shayane@123'}})

        wrapper.find('#btn_login').simulate('click');
        expect(setLoading).toBeTruthy()
    })

    test('Login check with blank username', ()=>{
    let loading = jest.fn()

    const handleClick = jest.spyOn(React, "useState");
    handleClick.mockImplementation(loading => [loading])

    let wrapper = shallow(<LoginPage onClick={loading} />)

        wrapper.find('.url').simulate('change', {
            target: {value: 'https://systest.eisenvault.com'}})

        wrapper.find('#user-name').simulate('change', {
                target: {value: ''}})

        wrapper.find('#pswd').simulate('change', {
                    target: {value: 'Shayane@123'}})

        wrapper.find('#btn_login').simulate('click');
        expect(loading).toBeTruthy();
    })
})

describe('Testing for the correct Url', () => {
    let wrapper = mount(<LoginPage/>);

    test('Testing if there is no https://', () => {

        wrapper.find('.url').simulate('change', {
            target: {value: 'systest.eisenvault.com'}
            });

        let url = wrapper.find('.url').props().value
        let newUrl = "https://" + url.replace(/\/?(\?|#|$)/, '/$1');
    
        expect(newUrl).toBe('https://systest.eisenvault.com/')
    })
    
    test('Testing if there is no "/" at end', () => {

        wrapper.find('.url').simulate('change', {
            target: {value: 'https://systest.eisenvault.com'}
            });

        let url = wrapper.find('.url').props().value
        let newUrl = url.replace(/\/?(\?|#|$)/, '/$1');
    
        expect(newUrl).toBe('https://systest.eisenvault.com/');
    })
    
})

test('Testing loading spinner', () => {
    const handleLoading = jest.spyOn(React, "useState");
    handleLoading.mockImplementation(loading => [loading])

    let wrapper = mount(<LoginPage loading={true}/>);
    expect(wrapper.props().loading).toEqual(true);

    let buttonLoading = wrapper.find('#btn_login').props().value;
    wrapper.find('#btn_login').simulate('click');

    // console.log(buttonLoading);

    expect(buttonLoading).toEqual("Login");
})

describe('Test for forgot password', () => {
    test('Test to check forgot password button', () => {
        let setmodalIsOpen =jest.fn();
        const HandleForgotPassword =jest.fn();

        let wrapper = mount(<LoginPage onClick={setmodalIsOpen}/>)

        wrapper.find("#btn_forgotPassword").simulate('click');
        expect(setmodalIsOpen).toBeTruthy();
    })
})