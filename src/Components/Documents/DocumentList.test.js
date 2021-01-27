import React from 'react';
import moxios from 'moxios';
import axios from 'axios';
import { Router } from "react-router";
import { createMemoryHistory } from "history";
import Enzyme, { mount, shallow ,render} from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import DocumentList  from '../Documents/DocumentList';
import Pagination from '../Pagination/Pagination';

const mockHistoryPush = jest.fn();
const mockgetUser = jest.fn().mockResolvedValue("admin")
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
    getUser: () => ({ 
        user: mockgetUser
    })
    }));
    const deleteApi = `https://systest.eisenvault.net/alfresco/api/-default-/public/alfresco/versions/1/sites/23677089-6b09-477c-a396-dab9810c90bc?permanent=false`
describe("<DocumentList/>", () => {
    let props;  
    let wrapper;
    let useEffect;
    let useState;
    const  setDepartments = jest.fn().mockImplementationOnce();;
    const  handleDocumentLibrary = jest.fn();
    const  next = jest.fn();
    const  previous = jest.fn();
    Enzyme.configure({ adapter: new EnzymeAdapter() })

    let mockUseEffect = () => {
      useEffect.mockImplementationOnce(f => f());
    };
  
    const user = 'admin';
    const deletemodalIsOpen = true;
    const departments = [{entry:{guid: "05490422-245e-49f0-84ce-1e3c7558aabb",
        id: "webinar",
        preset: "site-dashboard",
        role: "SiteManager",
        title: "Accounts",
        visibility: "MODERATED",
    }}];
  
    beforeEach(() => {
        moxios.install();
        moxios.stubRequest(`https://systest.eisenvault.net/alfresco/api/-default-/public/alfresco/versions/1/sites?maxItems=10&skipCount=0`, { status: 200,         
        response: {  "success": true }
    })
        useEffect = jest.spyOn(React, "useEffect");
        useState = jest.spyOn(React, "useState");
        props = {
           
            getDepartments: jest.fn().mockResolvedValue(departments),
            handleprev: previous,
            handlenext: next,
        };

        mockUseEffect();
        setDepartments();
        React.useState = jest.fn()
        .mockReturnValueOnce([departments, setDepartments])
        .mockReturnValueOnce([deletemodalIsOpen, {}])
        
        wrapper = shallow(<DocumentList {...props} onClick={ handleDocumentLibrary() } next={next()} previous={previous()}/>);
        // console.log(wrapper.debug())
    })

    afterEach(() => {
        moxios.uninstall();
    })

    test('render the title of page', () => {
        expect(wrapper.find("h2").text()).toContain("My Departments");
        })

    test('render profile picture', () => {
        expect(wrapper.find(".profile_picture")).toBeTruthy;
        })

    test('render the search bar', () => {
        expect(wrapper.find(".search-profile")).toBeTruthy;
        })
    test('render the table', () => {
        expect(wrapper.find("#doc_list")).toBeTruthy;
        })

    test('render the table row', () => {
        expect(wrapper.find(".details")).toBeTruthy;
        })

    test('render the title of department', () => {
        expect(wrapper.find(".fileicon").text()).toContain("Accounts");
        })

    test('render the department icon', () => {
        expect(wrapper.find(".fas")).toBeTruthy;
        })
        
    test('render the Document Library Option', () => {
        expect(wrapper.find('.fileDetails').text()).toContain("Document Library")
        })

    test('test library button' , () => {
        wrapper.find(".fileDetails").simulate("click");
        expect(handleDocumentLibrary).toBeCalled()
    })

    test('render loading indicator', () => {
        expect(wrapper.find("LoadingIndicator")).toBeTruthy;
    })
    test('render pagination', () => {
        expect(wrapper.find("Pagination")).toBeTruthy;
    })
    test('test library button' , () => {
        wrapper.find("Pagination").simulate("click");
        expect(next).toBeCalled()
    })
    test("API call was successful", (done) => {
		moxios.stubRequest(deleteApi, { status: 200,         
			response: {  "success": true }
	}) //mocked response
	
		axios.delete(deleteApi, 
		{  "success": true }).then(	
		response => {	
			expect(response.status).toBe(200);

			const status = response.status
			// console.log(response.status);
			return status;
		})
		done();
	  });
})
describe("<Pagination/>", () => {
    let wrapper1;
    const  next  = jest.fn();
    const  previous = jest.fn();
    beforeEach(() => {
        wrapper1 = shallow(<Pagination handleNext  ={next()} handlePrev ={previous()}/>)
        console.log(wrapper1.debug())
    })
    test("pagination renders correctly" , () => {
        expect(wrapper1.find(".pagination").toBeTruthy);
    })
    test("test previous button" , () => {
        expect(wrapper1.find("#myprevBtn").toBeTruthy);
        wrapper1.find("#myprevBtn").simulate("click");
        expect(previous).toBeCalled();
    })
    test("test previous button" , () => {
        expect(wrapper1.find("#myprevBtn").toBeTruthy);
        wrapper1.find("#myBtn").simulate("click");
        expect(previous).toBeCalled();
    })
});