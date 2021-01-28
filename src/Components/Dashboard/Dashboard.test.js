import React from 'react';
import moxios from 'moxios';
import Enzyme, { mount, shallow } from 'enzyme';
// import { findByTestAttr } from '../../test/testUtils';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import Dashboard from './Dashboard';

beforeEach(() => {
    moxios.install();
    moxios.stubRequest(`https://systest.eisenvault.net/alfresco/api/-default-/public/alfresco/versions/1/people/Shayane/activities`, {
        status: 200,
    });
})

afterEach(() => {
    moxios.uninstall();
})

Enzyme.configure({ adapter: new EnzymeAdapter() })



test('Load the Activities Successfully', async () => {
    const wrapper = mount(<Dashboard/>)

	const docDetails = wrapper.find("#docDetails");
    const documents = wrapper.find('documents');
    // expect(documents).toEqual(1);

    // Let's check what wrong in our instance
    // console.log(wrapper.debug());
    console.log(documents.length)
    expect(docDetails.length).toEqual(1);
});

test('check for pagination component', () => {
    const wrapper = mount(<Dashboard/>)
    expect(wrapper.find('Pagination').length).toBe(1);
   });
   

test("test title of the page",()=>{
    const wrapper = mount(<Dashboard/>)
    expect(wrapper.find("h2").text()).toContain("Dashboard")
})
test('get search profile',()=>{
    const wrapper = mount(<Dashboard/>)
    expect(wrapper.find(".search-profile")).toBeTruthy
})
test('render profile picture', () => {
    const wrapper = mount(<Dashboard/>)
    expect(wrapper.find(".title")).toBeTruthy;
})
test('render heaading of page',()=>{
    const wrapper = mount(<Dashboard/>)
    expect(wrapper.find("h3").text()).toContain("My Recent Activities")
})


describe("test for react hooks",()=>{
    
    const setDocuments = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState')
    useStateSpy.mockImplementation((init) => [init, setDocuments]);
    beforeEach(() => {
        
        const wrapper =mount(<Dashboard />);
     });
    
    afterEach(() => {
      jest.clearAllMocks();
    });
})