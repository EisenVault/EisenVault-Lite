import React from 'react';
import Enzyme, { mount, shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import Backdrop from './Backdrop';

Enzyme.configure({ adapter: new EnzymeAdapter() })

const click = jest.fn();
const show = jest.fn();

const props = { show,  click}
const wrapper = mount (<Backdrop show={true} onClick={click} />);

test('Checking the backdrop', ()=>{
    wrapper.find('.Backdrop').simulate('click');
    expect(props.show).toBeTruthy();
});