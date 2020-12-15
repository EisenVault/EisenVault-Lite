import React from 'react';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import FullAudittrails from './FullAuditTrails';

import { Router } from "react-router";
import { createMemoryHistory } from "history";

import axios from 'axios';
import moxios from 'moxios';

Enzyme.configure({ adapter: new EnzymeAdapter() })
const history = createMemoryHistory();

const wrapper2 = mount(<Router history={history}>
    <FullAudittrails/>
    </Router>)

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        title: 'file1',
    }),
    }));

const api = `https://systest.eisenvault.net/alfresco/s/ev/nodeaudittrail?nodeRef=workspace://SpacesStore/372c7861-e09a-41ae-8c6d-7bbc7877ad79`

describe("Tests for API", () => {
    beforeEach(() => {
        moxios.install()
    })

      afterEach(() => {
        moxios.uninstall()
      })

      test("Check for the response", (done) => {
        moxios.stubRequest(api, { status: 200,         
                response: {  "success": true }
        }) //mocked response

        axios.get(api, {  "success": true }).then(response => {
            // console.log(response);
            expect(response.status).toBe(200);
            done();
        });
    });
});

describe("Check for the table content", () => {
    test("Check for the back button", () => {
        wrapper2.find("button").simulate("click");
        expect(history.location.pathname).toBe("/");
    })

    test("Check for table head", () => {
        expect(wrapper2.find(".label-input").length).toBe(1);
    })

    test("Check for Actions", () => {
        expect(wrapper2.find(".actions").length).toBe(1)
    })

    test("Check for User", () => {
        expect(wrapper2.find(".users").length).toBe(1)
    })

    test("Check for Time", () => {
        expect(wrapper2.find(".time").length).toBe(1)
    })
})