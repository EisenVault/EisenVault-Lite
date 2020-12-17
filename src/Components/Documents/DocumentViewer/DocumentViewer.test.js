import React from 'react';
import { cleanup } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import DocPreview from './DocumentViewer';

Enzyme.configure({ adapter: new EnzymeAdapter() });

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        title: 'file1',
    }),
    }));

const toggleSidebar = jest.fn()

const wrapper = mount (
    <MemoryRouter>
        <DocPreview/>
    </MemoryRouter>
);

test('Check for the iframe',() => {
    expect(wrapper.find("iframe")).toBeTruthy();
})

test('Check for back-button',() => {
    expect(wrapper.find(".back-button").length).toBe(1);
})

test('Check for more details button', () => {
    expect(wrapper.find(".details").length).toBe(1);
})

test('Check viewer is working properly', () => {
    const toggleButton = wrapper.find("ToggleButton").at(0);
    expect(toggleButton).toBeTruthy();

    toggleButton.simulate('submit');
    expect(toggleSidebar).toBeTruthy();
    
    afterEach(cleanup);
})