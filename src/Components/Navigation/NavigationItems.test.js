import React from 'react';
import moxios from 'moxios';
import axios from 'axios';
import { Router } from "react-router";
import { createMemoryHistory } from "history";
import Enzyme, { mount, shallow ,render} from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import NavigationItems from '../Navigation/NavigationItems/NavigationItems';

Enzyme.configure({ adapter: new EnzymeAdapter() })
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

describe("<NavigationItems/>", () => {
    let wrapper;
    const  handleLogout = jest.fn();
    beforeEach(() => {
        wrapper = shallow(<NavigationItems  onClick={ handleLogout() } />);
    })
    test("test logout function" , () => {
        wrapper.find(".signOut").simulate("click");
        expect(handleLogout).toBeCalled()
    })
})