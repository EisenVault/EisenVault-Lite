import React from 'react';
import moxios from 'moxios';
import Enzyme, { shallow } from 'enzyme';
import { findByTestAttr } from '../../test/testUtils';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import LoginPage from './Login';

Enzyme.configure({ adapter: new EnzymeAdapter() })

// const initialProps = {
//     url: 'https://systest.eisenvault.com',
//     userName: 'Shayane',
//     password: 'Shayane@123',
//   };

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
        expect(wrapper.find('#pswd').at(0).props().placeholder).toEqual('Password')
    })

    test('Login button', () => {
        expect(wrapper.find('#btn_login').text()).toEqual('Login')
    })

    test('Login button', () => {
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