import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import ManageShares from './ManageShares';

Enzyme.configure({ adapter: new EnzymeAdapter() })

let wrapper = shallow(<ManageShares />)

// console.log(wrapper.debug());

describe('Check for the table and headers', () => {
    test('Check for the table', () => {
        expect(wrapper.find('table')).toBeTruthy();
    })

    test('Check for the table rows', () => {
        expect(wrapper.find('tr')).toBeTruthy();
    })

    test('Check for the table header - Item names', () => {
        expect(wrapper.find('#item-names')).toBeTruthy();
    })

    test('Check for the table header - Effective From', () => {
        expect(wrapper.find('.EffectiveFrom')).toBeTruthy();
    })

    test('Check for the table header - Effective To', () => {
        expect(wrapper.find('.EffectiveTo')).toBeTruthy();
    })

    test('Check for the table header - Action', () => {
        expect(wrapper.find('#action')).toBeTruthy();
    })
})