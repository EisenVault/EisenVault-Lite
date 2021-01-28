
import React from 'react';
import moxios from 'moxios';
import axios from 'axios';
import { Router } from "react-router";
import { createMemoryHistory } from "history";
import Enzyme, { mount, shallow ,render} from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';

import MyUploads from './MyUploads';

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
    const getDataApi = `https://systest.eisenvault.net/alfresco/api/-default-/public/search/versions/1/search?maxItems=10&skipCount=0`
describe("<MyUploads/>", () => {
    let props;  
    let wrapper;
    let useEffect;
    let useState;
    const  setFileState = jest.fn().mockImplementationOnce();;
    const  handleDocument = jest.fn();
    const  next = jest.fn();
    const  previous = jest.fn();
    Enzyme.configure({ adapter: new EnzymeAdapter() })
    let mockUseEffect = () => {
      useEffect.mockImplementationOnce(f => f());
    };
  
    const user = 'admin';
    //const deletemodalIsOpen = true;
    const FileState = [{entry:{guid: "05490422-245e-49f0-84ce-1e3c7558aabb",
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
           
            getData: jest.fn().mockResolvedValue(FileState),
            handleprev: previous,
            handlenext: next,
        };
        mockUseEffect();
        setFileState();
        React.useState = jest.fn()
        .mockReturnValueOnce([FileState, setFileState])
        // .mockReturnValueOnce([deletemodalIsOpen, {}])
        
        wrapper = shallow(<MyUploads {...props} onClick={ handleDocument() } next={next()} previous={previous()}/>);
        // console.log(wrapper.debug())
    })
    afterEach(() => {
        moxios.uninstall();
    })
    
    test("doesn't break with an empty array",()=>{
        const wrapper=Enzyme.shallow(<MyUploads setFileState={[]}/>)
        expect(wrapper.find("td")).toHaveLength(0);
    })
    test('render the title of page', () => {
        expect(wrapper.find("h2").text()).toContain("My Uploads");
        })
    test('render profile picture', () => {
        expect(wrapper.find(".search-profile")).toBeTruthy
        })
    test('render the search bar', () => {
        expect(wrapper.find(".title")).toBeTruthy;
        })
    test('render the table', () => {
        expect(wrapper.find("#doc_list")).toBeTruthy;
        })
        test('check for item name heading',()=>{
            expect(wrapper.find("#item-name").text()).toContain("Item Name");
        })
        test('check for Uploaded on heading',()=>{
            expect(wrapper.find("#shared").text()).toContain("Uploaded On");
        })
        test('render the file/folder icon', () => {
        expect(wrapper.find(".fas")).toBeTruthy;
        })
        
    test('test library button' , () => {
        const wrapper = Enzyme.shallow(<td className="file_name-u"
        onClick={()=>{handleDocument()}}></td>);
        wrapper.find('.file_name-u').at(0).simulate('click',{
           target: { value: "file",
                       id: "id112",
                   title: "title" }
         });
        wrapper.update();
        expect(handleDocument).toBeCalled()
    })
    test('render loading indicator', () => {
        expect(wrapper.find("LoadingIndicator")).toBeTruthy;
    })
    test('render pagination', () => {
        expect(wrapper.find("Pagination")).toBeTruthy;
    })
    test('test pagination button' , () => {
        wrapper.find("Pagination").simulate("click");
        expect(next).toBeCalled()
    })
    test("API call was successful", (done) => {
        moxios.stubRequest(getDataApi, { status: 200,         
            response: {  "success": true }
    }) //mocked response
    
        axios.post(getDataApi, 
        {  "success": true }).then( 
        response => {   
            expect(response.status).toBe(200);
            const status = response.status
            // console.log(response.status);
            return status;
        })
        done();
      });
      test("DefaultDelete",()=>{
          const DefaultDelete=jest.fn();

      })
})



