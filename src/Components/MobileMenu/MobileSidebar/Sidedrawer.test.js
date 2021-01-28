import React from 'react';
import Enzyme, { shallow , mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import SideDrawer from './SideDrawer';
import { HashRouter as Router } from "react-router-dom";
Enzyme.configure({ adapter: new EnzymeAdapter() })

let wrapper = shallow(<SideDrawer />)

// console.log(wrapper.debug());

describe('Tests for the sideDrawer elements', () => {
    test('sidebar should render correctly', () => {
        const sidebar = shallow(<SideDrawer />);
        expect(sidebar).toMatchSnapshot();
      });
      
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


test("check click event on logout button",()=>{
    const LOGOUT="logout";
    beforeEach(()=>{
        const input=wrapper.find(".signOut");
        input.simulate('click',{
            target: {value : LOGOUT}
        })
    });})


    describe('<Sidedrawer/>', () => {
        let drawerclasses='Side-drawer open'
        test('should call fetch on mount if prop: reloadData is true', () => {
          const wrapper = mount(
              <Router>
            <SideDrawer 
              show={true}
            >
            </SideDrawer></Router>
          )
          expect(drawerclasses).toBe('Side-drawer open')
        })
        test("should call handleLogOut function",()=>{
            const handleLogOut=jest.fn();
            const wrapper=shallow(<input type="button" className="signOut"  onClick={handleLogOut} value="LOGOUT" />);
            wrapper.find('.signOut').at(0).simulate('click');
            expect(handleLogOut).toHaveBeenCalled();
            
        })
    })
    