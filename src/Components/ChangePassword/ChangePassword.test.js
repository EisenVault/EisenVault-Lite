import React from 'react';
import moxios from 'moxios';
import axios from 'axios';

import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import ChangePassword from './ChangePassword';

Enzyme.configure({ adapter: new EnzymeAdapter() })

const handlechangePassword = jest.fn();

const wrapper = mount(<ChangePassword 
	onClick={handlechangePassword()}
	/>);

const api = `https://systest.eisenvault.net/alfresco/service/api/person/changepassword/Shayane`

describe("Tests for password change", () => {
    beforeEach(() => {
        moxios.install()
    })

      afterEach(() => {
        moxios.uninstall()
	  })
	  
	  test("API call was successful", (done) => {
		moxios.stubRequest(api, { status: 200,         
			response: {  "success": true }
	}) //mocked response
	
		axios.post(api, 
		{  "success": true }).then(	
		response => {	
			expect(response.status).toBe(200);

			const status = response.status
			// console.log(response.status);
			return status;
		})
		done();
	  });

	  test("Check for the input fields", () => {
		  expect(wrapper.find("#oldPswd").length).toBe(1);
		  expect(wrapper.find("#newPswd").length).toBe(1);
		  expect(wrapper.find("#confirmPswd").length).toBe(1);
	  })

      test("Changed the password successfully", () => {

		wrapper.find('#oldPswd').simulate('change', {
			target: {value: 'Shayane@123'}});

		wrapper.find('#newPswd').simulate('change', {
			target: {value: 'Shayane@1234'}});

		wrapper.find('#confirmPswd').simulate('change', {
			target: {value: 'Shayane@1234'}});

		expect(wrapper.find(".btn01").length).toBe(1);
		wrapper.find(".btn01").simulate('click');

		expect(handlechangePassword).toHaveBeenCalled();
	});
		
		test("The password was unsuccessfully as Password does not match", () => {
			window.alert = jest.fn();

			wrapper.find('#oldPswd').simulate('change', {
				target: {value: 'Shayane@123'}})
	
			wrapper.find('#newPswd').simulate('change', {
				target: {value: 'Shayane@1234'}})
	
			wrapper.find('#confirmPswd').simulate('change', {
				target: {value: 'Shayane@123'}})
	
			wrapper.find(".btn01").simulate('click');
	
			expect(window.alert).toBeCalledWith('Password does not match');
		});
    });