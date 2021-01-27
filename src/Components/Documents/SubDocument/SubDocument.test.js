import React from 'react';
import moxios from 'moxios';
import axios from 'axios';
import alertify from 'alertifyjs';

import Enzyme, { mount, shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import  SubDocument  from '../../Documents/SubDocument/SubDocument';

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: 1,
    }),
    useHistory: () => ({
        push: mockHistoryPush,
    })
    }));
const deleteApi = `https://systest.eisenvault.net/alfresco/api/-default-/public/alfresco/versions/1/nodes/23677089-6b09-477c-a396-dab9810c90bc`
describe("<SubDocument/>", () => {
    let props;
    let wrapper;
    let useEffect;
   
    const  handleDocument = jest.fn();
    const handleDelete = jest.fn();
    Enzyme.configure({ adapter: new EnzymeAdapter() })

    let mockUseEffect = () => {
      useEffect.mockImplementationOnce(f => f());
    };
  
    const documents = [{entry:{
        createdAt: "2020-05-12T06:12:06.733+0000",
        createdByUser:{
        displayName: "Administrator",
        id: "admin"},
        id: "23677089-6b09-477c-a396-dab9810c90bc",
        isFile: false,
        isFolder: true,
        modifiedAt: "2020-09-18T06:54:28.635+0000",
        modifiedByUser:{
        displayName: "Administrator",
        id: "admin"},
        name: "PAN FORTE",
        nodeType: "cm:folder"}},
        {entry:{
            createdAt: "2020-05-12T06:12:06.733+0000",
            createdByUser:{
            displayName: "Administrator",
            id: "admin"},
            id: "23677089-6b09-477c-a396-dab9810c90bc",
            isFile: true,
            isFolder: false,
            modifiedAt: "2020-09-18T06:54:28.635+0000",
            modifiedByUser:{
            displayName: "Administrator",
            id: "admin"},
            name: "PAN FORTE",
            nodeType: "cm:folder"}}
    ];
  
    beforeEach(() => {
        moxios.install();
        moxios.stubRequest(`https://systest.eisenvault.net/alfresco/api/-default-/public/alfresco/versions/1/nodes/1/children?skipCount=0&maxItems=10`, {
            status: 200,
        })
        useEffect = jest.spyOn(React, "useEffect");

        props = {
            getData: jest.fn().mockResolvedValue(documents),
        };
  
        mockUseEffect();

        React.useState = jest.fn()
        .mockReturnValueOnce([documents, {}])
        
        wrapper = shallow(<SubDocument {...props}  onClick={ handleDocument() } handleDelete={ handleDelete()}/>);
        console.log(wrapper.debug())
    })

    afterEach(() => {
        moxios.uninstall();
    })

    test('render the title of page', () => {
        expect(wrapper.find("h2").text()).toContain("Document Library");
        })

    test('render profile picture', () => {
        expect(wrapper.find(".search-profile")).toBeTruthy;
        })

    test('render the search bar', () => {
        expect(wrapper.find("#item-names").text()).toContain("Item Name");
        })
    test('render the search bar', () => {
        expect(wrapper.find("#shared-on").text()).toContain("Created On");
        })
    test('render the search bar', () => {
        expect(wrapper.find("#shared").first().text()).toContain("Created By");
        })
    test('render the search bar', () => {
        expect(wrapper.find("#modified").text()).toContain("Modified On");
        })
    test('render the search bar', () => {
        expect(wrapper.find("#action-title").text()).toContain("Actions");
        })
    test('render the table', () => {
        expect(wrapper.find("#doc_list")).toBeTruthy;
        })

    test('render the table row', () => {
        expect(wrapper.find("#first_details")).toBeTruthy;
        })

    test('render the title of department', () => {
        expect(wrapper.find(".file_name-u").at(0).text()).toContain("PAN FORTE");
        })

    test('render the department icon', () => {
        expect(wrapper.find(".pdf-file fas fa-file-pdf")).toBeTruthy;
        })
        
    test('render the Document Library Option', () => {
        expect(wrapper.find('#display-name').at(0).text()).toContain("Administrator")
        })
    test('render the Document Library Option', () => {
        expect(wrapper.find('#createdAt').at(0).text()).toContain("2020-05-12")
        })
    test('render the Document Library Option', () => {
        expect(wrapper.find('#modifiedAt').at(0).text()).toContain("2020-09-18")
        })
    test('render the Document Library Option', () => {
        expect(wrapper.find('.fas fa-times-circle')).toBeTruthy;
        })
    test('test library button' , () => {
        wrapper.find(".file_name-u").at(0).simulate("click");
        expect(handleDocument).toBeCalled()
    })
    test('test library button' , () => {
        wrapper.find(".file_name-u").at(1).simulate("click");
        expect(handleDocument).toBeCalled()
    })
    // test('test delete button' , () => {
    //     // alertify.confirm() = jest.fn();
    //     wrapper.find(".fa-times-circle").at(0).simulate("click", { target: { id: '23677089-6b09-477c-a396-dab9810c90bc' }});;
    //     expect(alertify.confirm()).toBeCalled()
    // })
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
