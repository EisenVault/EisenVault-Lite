import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { DrawerToggleButton } from './MobileMenu';

Enzyme.configure({ adapter: new EnzymeAdapter() })

let wrapper = shallow(<DrawerToggleButton />)

test('Check for the button', () => { 
    expect(wrapper.find('button')).toBeTruthy();
})

test('Check for the lines', () => { 
    expect(wrapper.find('.toggle-button__line')).toBeTruthy();
})