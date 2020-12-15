import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import SideDrawer from './SideDrawer';

Enzyme.configure({ adapter: new EnzymeAdapter() })

let wrapper = shallow(<SideDrawer />)

// console.log(wrapper.debug());

describe('Tests for the sideDrawer elements', () => {
    test('Check for the nav tag', () => {
        expect(wrapper.find('nav')).toBeTruthy();
    })

    test('Check for the dashboard', () => {
        expect(wrapper.find('#dashboard')).toBeTruthy();
    })

    test('Check for the departments', () => {
        expect(wrapper.find('#departments')).toBeTruthy();
    })

    test('Check for the myUploads', () => {
        expect(wrapper.find('#myUploads')).toBeTruthy();
    })
    
    test('Check for the manageShares', () => {
        expect(wrapper.find('#manageShares')).toBeTruthy();
    })

    test('Check for the support', () => {
        expect(wrapper.find('#support')).toBeTruthy();
    })

    test('Check for the fullVersion', () => {
        expect(wrapper.find('#fullVersion')).toBeTruthy();
    })

    test('Check for the trash', () => {
        expect(wrapper.find('#trash')).toBeTruthy();
    })

    test('Check for the change password', () => {
        expect(wrapper.find('#changePswd')).toBeTruthy();
    })

    test('Check for the Logout Button', () => {
        expect(wrapper.find('.signOut')).toBeTruthy();
    })
})