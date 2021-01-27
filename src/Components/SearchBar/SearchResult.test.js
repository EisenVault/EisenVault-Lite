import React from 'react';
import moxios from 'moxios';

import { Router } from "react-router";
import { createMemoryHistory } from "history";

import Enzyme, { mount, shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import  SearchResult  from './SearchResult';
import Pagination from "../Pagination/Pagination";

const mockHistoryPush = jest.fn();
Enzyme.configure({ adapter: new EnzymeAdapter() })

// const wrapper2 = mount(<Router history={history}>
//     <SearchResult/>
//     </Router>)

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        result: "DMS",
    }),
    useHistory: () => ({
        push: mockHistoryPush,
    })
    }));

describe("<SearchResult/>", () => {
    let props;
    let wrapper;
    let useEffect;
   
    const  handleDocument = jest.fn();
    const  setDocuments = jest.fn();
    const previous = jest.fn()
    const next = jest.fn()
    let mockUseEffect = () => {
      useEffect.mockImplementationOnce(f => f());
    };
  
    const documents = [{entry:{
        path:{
        name: "Administrator",
        id: "admin"},
        id: "23677089-6b09-477c-a396-dab9810c90bc",
        isFile: false,
        isFolder: true,
        name: "PAN FORTE",
        nodeType: "cm:folder"}
        },
        {entry:{
            path:{
            name: "Administrator",
            id: "admin"},
            id: "23677089-6b09-477c-a396-dab9810c90bc",
            isFile: true,
            isFolder: false,
            name: "PAN FORTE",
            nodeType: "cm:folder"}
            }
    ];
  
    beforeEach(() => {
        moxios.install();
        moxios.stubRequest(`https://systest.eisenvault.net/alfresco/api/-default-/public/search/versions/1/search`, {
            status: 200,
        })
        useEffect = jest.spyOn(React, "useEffect");

        props = {
            trackPromise: jest.fn().mockResolvedValue(documents),
           
        };
  
        mockUseEffect();

        React.useState = jest.fn()
        .mockReturnValueOnce([documents, setDocuments])
        
        wrapper = shallow(<SearchResult {...props}  handleDocument={ handleDocument() } />);
        // console.log(wrapper.debug())
    })

    afterEach(() => {
        moxios.uninstall();
    })

    test('render the title of page', () => {
        expect(wrapper.find("h2").text()).toContain("SearchResult");
        })

    test('render results', () => {
        expect(wrapper.find(".filesShared")).toBeTruthy;
        })

    test('render the table', () => {
        expect(wrapper.find("#doc_list")).toBeTruthy;
        })
    test('render the search bar', () => {
        expect(wrapper.find("#item-names").text()).toContain("Item Name");
        })
    test('render the search bar', () => {
        expect(wrapper.find("#shared").text()).toContain("Department Name");
        })
    test('render the search bar', () => {
        expect(wrapper.find("Item")).toBeTruthy;
        })
    test('render the search bar', () => {
        expect(wrapper.find("#action-title").text()).toContain("Actions");
        })
    test('render the table row', () => {
        expect(wrapper.find("#first_details")).toBeTruthy;
        })

    test('render the title of file', () => {
        expect(wrapper.find(".file_name-u").first().text()).toContain("PAN FORTE");
        })
    test('test library button' , () => {
        wrapper.find(".file_name-u").at(0).simulate("click", { target: { id: '23677089-6b09-477c-a396-dab9810c90bc', name: "Administrator", type: false } });
        expect(handleDocument).toHaveBeenCalled()
    })
    test('test library button' , () => {
        wrapper.find(".file_name-u").at(1).simulate("click", { target: { id: '23677089-6b09-477c-a396-dab9810c90bc', name: "Administrator", type: true } });
        expect(handleDocument).toHaveBeenCalled()
    })
    test('render the department icon', () => {
        expect(wrapper.find(".pdf-file fas fa-file-pdf")).toBeTruthy;
        })
        
    test('render the Document Library Option', () => {
        expect(wrapper.find('.details-u-s').first().text()).toContain("Administrator")
        })
    test('render the Document Library Option', () => {
        expect(wrapper.find('.fas fa-times-circle')).toBeTruthy
        })
       
    test('render the Document Library Option', async () => {
       await expect(wrapper.find('LoadingIndicator')).toBeTruthy
        })
         ;
   
    test('render the Document Library Option', () => {
        expect(wrapper.find('Pagination')).toBeTruthy;
        })
    test('does something', () => {
        let wrapper1;
        wrapper1 = mount(<Pagination previous={previous()} next={next()}/>)
        console.log(wrapper1.debug())
        wrapper1.find('button').at(0).simulate('click')
            expect(previous).toBeCalled();
        });
})
