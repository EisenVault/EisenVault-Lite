import React from 'react';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import ProgressBar, { BytesToSize } from './ProgressBar';

import moxios from 'moxios';
import axios from 'axios';

Enzyme.configure({ adapter: new EnzymeAdapter() })

describe('Checking the function BytesToSize', () => {
    test('When bytes === 0', ()=>{
        const value = BytesToSize(0, " ");
        expect(value).toBe('n/a');
    })
    
    test('When bytes === 2024', ()=>{
        const value = BytesToSize(2024, " ");
        expect(value).toBe('2.0 KB');
    })

})

const api = `https://systest.eisenvault.net/alfresco/s/aws-reposize`

describe("Tests for progressbar", () => {

    beforeEach(() => {
        moxios.install()
    })

      afterEach(() => {
        moxios.uninstall();
        jest.clearAllMocks();
	  })
	  
	test("API call was successful", (done) => {
		moxios.stubRequest(api, { status: 200,         
			response: {  
                "storeFreeSpace": "536870912000",
                "storageSpaceConsumed": "33681900250",
                "success": true }
	}) //mocked response
	
		axios.get(api, 
		{  
        "storeFreeSpace": "536870912000",
        "storageSpaceConsumed": "33681900250",
        "success": true }).then(	
		response => {	
            expect(response.status).toBe(200);
            const data = response.data;

            const freeSpace = BytesToSize(data.storeFreeSpace, " ")
            const usedSpace = BytesToSize(data.storageSpaceConsumed, " ")
            
            console.log(freeSpace);
            console.log(usedSpace);

			// console.log(response.status);
			return data;
		})
        done();
      })
    })

describe("Tests to check the storage space is displayed properly", () => {

    test("Test to check free space is not displayed when 'loading={true}", () => {
        const wrapper = mount(<ProgressBar loading={true}/>)

        expect(wrapper.find("#freeSpace").text()).toBe(" Free Space: Calculating.. ");
    })

    test("Test to check usedSpace space is not displayed when 'loading={true}", () => {
        const wrapper = mount(<ProgressBar loading={true}/>);

        expect(wrapper.find("#usedSpace").text()).toBe(" Used Space: Calculating.. ");    
    })
})