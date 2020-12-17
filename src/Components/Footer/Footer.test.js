import React from 'react';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import Footer from './Footer';

//set up enzyme's react adapter
Enzyme.configure({ adapter: new EnzymeAdapter() })

/***
 * Factory function to create a MountWrapper for the Back button component
 * @function setup
 * @returns {MountWrapper}
 ***/
const setup = () => mount(<Footer />);

test("renders without error", () => {
    const wrapper = setup()
    const footerComponent = wrapper.find(".base-footer")
    expect(footerComponent.length).toBe(1);
  });

test("correct footer", () => {
    const wrapper = setup()

    expect(wrapper.contains(
    <p className="footerSection">Copyright © 2020 
    <a href="https://eisenvault.com/">
      Argali Knowledge Services Pvt. Ltd., New Delhi, India
      </a></p>)).toBe(true)
})

test("Incorrect footer", () => {
    const wrapper = setup()

    expect(wrapper.contains(
    <p>Copyright © 2020 
    <a id="url" href="https://eisenvault.com/">
      Argali Knowledge Services Pvt. Ltd., New Delhi, India
      </a></p>)).toBe(false)
})