import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';

import {ForgotPassword} from './DeleteSumm';

Enzyme.configure({ adapter: new EnzymeAdapter() })

let wrapper = shallow(<ForgotPassword />);

describe('Testing all the elements of Forgot Password modal' , ()=>{
    test('Test for Modal', () => {    
    const modal = wrapper.find('.modal-header');
    expect(modal).toHaveLength(1);
});

test('Test for Heading', () => {    
    const heading = wrapper.find('#heading');
    expect(heading).toHaveLength(1);
});

test('Test for Message', () => {    
    const message = wrapper.find('#msg');
    expect(message).toHaveLength(1);
});

describe('Testing the input fields along with its labels', () => {

    test('Test for Input div', () => {    
        const inputDiv = wrapper.find('.label-input');
        expect(inputDiv).toHaveLength(1);
    });

    test('Test for url label', () => {    
        const urlLabel = wrapper.find('#url');
        expect(urlLabel.text()).toEqual('URL:')
    });

    test('Test for username label', () => {    
        const usernameLabel = wrapper.find('#username');
        expect(usernameLabel.text()).toEqual('Username:')
    });

    test('Test for url input', () => {    
        const inputUrl = wrapper.find('#urlFrgtPswd');
        expect(inputUrl).toHaveLength(1);
    });

    test('Test for username input', () => {    
        const inputUsername = wrapper.find('#forgotPswdUserName');
        expect(inputUsername).toHaveLength(1);
    });

})

describe('Testes for continue and cancel buttons', () => {
    test('Test for Continue button', () => {    
    const continueButton = wrapper.find('.btn-continue-p');
    expect(continueButton).toHaveLength(1);
    });

    test('Test for Cancel button', () => {    
        const cancelButton = wrapper.find('.btn-cancel-p');
        expect(cancelButton).toHaveLength(1);
        });
})

})
