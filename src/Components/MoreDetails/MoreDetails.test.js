import React from 'react';
import Enzyme, {shallow , mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import DocumentDetails from './MoreDetails';

import { cleanup } from '@testing-library/react';
import { createMemoryHistory } from "history";
import { Router } from "react-router";
import moxios from 'moxios';


Enzyme.configure({ adapter: new EnzymeAdapter() })

const history = createMemoryHistory();

const wrapper = mount(
    <Router history={history}>
        <DocumentDetails/>
    </Router>
    )

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        title: 'file1',
    }),
    }));

    describe("mocking axios request",()=>{
        beforeEach(function () {
            // import and pass your custom axios instance to this method
            moxios.install()
            moxios.stubRequest(`https://systest.eisenvault.net/alfresco/api/-default-/public/alfresco/versions/1/shared-links`, {
                status: 200,
                response: {}
          })
        });
        test('returns shared documents id' , async () => {
            const response = {
                data:{
                    entry:{
                          id:'1234'
                    }
                }
            }
            const sharedLink = response.data.entry.id
           expect(sharedLink).toEqual('1234'); 
        });
        afterEach( () => {
            moxios.uninstall();

        });
    })
    // const historyMock = { push: jest.fn() };

describe('Tests for elements of more details option', () => {
    test('Check button to share a document', ()=>{
        expect(wrapper.find(".shareLink").length).toBe(1);
    })

    test('Check text to share a document of the button', ()=> {
        expect(wrapper.find(".shareLink").text()).toEqual('Click here to share');
    })

    describe('Tests for the correct fields', () => {
        test('Test for doc type', () => {
            expect(wrapper.find('.top-heaading').text()).toEqual('Document Type: ');
        })

        test('Test for Created By', () => {
            expect(wrapper.find('.createdBy').text()).toEqual('Created By: ');
        })

        test('Test for created on', () => {
            expect(wrapper.find('.createdOn').text()).toEqual('Created On: ');
        })

        test('Test for modification date', () => {
            expect(wrapper.find('.modificationDate').text()).toEqual('Last Modified: ')
        })

        test('Test for doc size', () => {
            expect(wrapper.find('.docSize').length).toBe(1);
        })

        test('Test for Activities', () => {
            expect(wrapper.find('.activities').length).toBe(1);
        })

        test('Test for Current Version', () => {
            expect(wrapper.find('.latestVersion').text()).toEqual('Current Version: ');
        })
    })

    describe('Test for audit trail button', () => {
        test('Check the redirection of audit trail button', () => {
            const button = wrapper.find('#audit-trail');
            expect(button.length).toBe(1);
            button.simulate('click');
            expect(history.location.pathname).toBe("/actions/undefined/file1/AuditTrails");
            
            afterEach(cleanup);
        })
    })
})


    describe("test for share link button",()=>{
        test('check the share link button',()=>{
           const DocumentShare = jest.fn();
           const wrapper = shallow(<button className="shareLink" onClick={DocumentShare}/>);
           wrapper.find('.shareLink').at(0).simulate('click');
           expect(DocumentShare).toHaveBeenCalled();
       });
    })



