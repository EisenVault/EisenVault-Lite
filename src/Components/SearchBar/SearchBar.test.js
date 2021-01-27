import React from 'react';
import moxios from 'moxios';

import { Router } from "react-router";
import { createMemoryHistory } from "history";

import Enzyme, { mount, shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import  SearchBar  from './SearchBar';

const mockHistoryPush = jest.fn();
Enzyme.configure({ adapter: new EnzymeAdapter() })


jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    })
    }));

describe("<SearchBar/>", () => {
    let props;
    let wrapper;
   
    const  handleDocument = jest.fn();
    const  onChange = jest.fn();
    const  onEnter = jest.fn();
    const  setData = jest.fn();
    const  setShow =jest.fn();
    const data = [{
        path:{
        name: "Administrator",
        id: "admin"},
        id: "23677089-6b09-477c-a396-dab9810c90bc",
        isFile: false,
        isFolder: true,
        name: "PAN FORTE",
        nodeType: "cm:folder",
        nodeRef: "workspace://SpacesStore/7e38dd2b-08cf-4a8d-a640-0a53f315c52b"
        },
        {
            path:{
            name: "Administrator",
            id: "admin"},
            id: "23677089-6b09-477c-a396-dab9810c90bc",
            isFile: true,
            isFolder: false,
            name: "PAN Card",
            nodeType: "cm:folder",
            nodeRef: "workspace://SpacesStore/64836b0c-629c-40e4-a588-37a383000e49"
            }
    ];
    const show = true;
  
    beforeEach(() => {
        moxios.install();
        moxios.stubRequest(`https://systest.eisenvault.net/alfresco/s/slingshot/live-search-docs?t=dms&limit=5`, {
            status: 200,
        })

        props = {
            fetchData: jest.fn().mockResolvedValue(data),
        };


        React.useState = jest.fn()
        .mockReturnValueOnce([data, setData])
        .mockReturnValueOnce([show, setShow])
        
        wrapper = shallow(<SearchBar {...props}  handleDocument={ handleDocument() } onChange={ onChange() } onEnter={ onEnter() }/>);
        console.log(wrapper.debug())
    })

    afterEach(() => {
        moxios.uninstall();
    })

    test('render container', () => {
        expect(wrapper.find(".searchBox-container")).toBeTruthy;
    })
    test('render searchBox', () => {
        expect(wrapper.find(".searchBox")).toBeTruthy;
    })
    test('test input fields', () => {
        wrapper.find('input[type="text"]').simulate('change', {target: {value: 'dms'}});
        expect(onChange).toHaveBeenCalled()
    })
    test('test input fields', () => {
        wrapper.find('input[type="text"]').simulate('keyUp', {key: 'Enter'})
        expect(onEnter).toHaveBeenCalled()
        // expect(history.location.pathname).toBe("/search/${result}");
    })
    test('outsideClickhandler', () => {
        expect(wrapper.find("OutsideClickHandler")).toBeTruthy;
    })
    test('render search results', () => {
        expect(wrapper.find(".menu-container")).toBeTruthy;
    })
    test('render list', () => {
        expect(wrapper.find("ul").at(0)).toBeTruthy;
    })
    test('render list', () => {
        expect(wrapper.find("ul").at(1)).toBeTruthy;
    })
    test('render list item', () => {
        expect(wrapper.find("li").at(0).text()).toContain("PAN FORTE");
    })
    test('render list item', () => {
        expect(wrapper.find("li").at(1).text()).toContain("PAN Card");
    })
    test('render list item', () => {
        expect(wrapper.find("li").at(0).simulate("click", { target: { id: '23677089-6b09-477c-a396-dab9810c90bc', name: "Administrator" } }));
        expect(handleDocument).toHaveBeenCalled()
    })
})
