import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { Item } from './backButton';

//set up enzyme's react adapter
Enzyme.configure({ adapter: new EnzymeAdapter() })

/***
 * Factory function to create a ShallowWrapper for the Back button component
 * @function setup
 * @returns {ShallowWrapper}
 ***/
const setup = () => shallow(<Item />);
const wrapper = setup()

const findByTestAttr = (wrapper, val) => wrapper.find(`[data-test='${val}']`)

const button = findByTestAttr(wrapper, "back-button")
const appComponent = findByTestAttr(wrapper, "component-app")

test("renders without error", () => {
  expect(appComponent.length).toBe(1);
});

test("renders button", () => {
  expect(button.length).toBe(1);
});