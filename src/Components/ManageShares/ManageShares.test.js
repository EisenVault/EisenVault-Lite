import React from 'react';
import moxios from 'moxios';
import Enzyme, { shallow } from 'enzyme';
import { createMemoryHistory } from "history";
import EnzymeAdapter from 'enzyme-adapter-react-16';
import ManageShares from './ManageShares';

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
    //const deleteApi = `https://systest.eisenvault.net/alfresco/api/-default-/public/alfresco/versions/1/sites/23677089-6b09-477c-a396-dab9810c90bc?permanent=false`
describe("<DocumentList/>", () => {
    let props;  
    let wrapper;
    let useEffect;
    let useState;
    const  setFileState = jest.fn().mockImplementationOnce();;
    const  handleDocument = jest.fn();
    Enzyme.configure({ adapter: new EnzymeAdapter() })

    let mockUseEffect = () => {
      useEffect.mockImplementationOnce(f => f());
    };
  
    const FileState = [{entry:{EFFECTIVEFROM:"2020-09-18T06:54:28.635+0000",
    EFFECTIVETO:"2020-09-18T06:54:28.635+0000",
    nodeId: "23677089-6b09-477c-a396-dab9810c90bc",
    name:"Accounts"}}];

    const DetailsState = [{entry:{EFFECTIVEFROM:"2020-09-18T06:54:28.635+0000",
    EFFECTIVETO:"2020-09-18T06:54:28.635+0000",
    NAME:"Accounts"}}];

    beforeEach(() => {
        moxios.install();
        moxios.stubRequest(`https://systest.eisenvault.net/alfresco/api/-default-/public/alfresco/versions/1/shared-links?skipCount=0&maxItems=10&include=properties&where=(sharedByUser='-me-')`, {
            status: 200,
        })
        moxios.stubRequest(`https://systest.eisenvault.net/alfresco/api/-default-/public/alfresco/versions/1/nodes/23677089-6b09-477c-a396-dab9810c90bc?include=properties`, {
            status: 200,
        })
        useEffect = jest.spyOn(React, "useEffect");
        useState = jest.spyOn(React, "useState");
        props = {
           
            getDetailsData: jest.fn().mockResolvedValue(FileState , DetailsState),
        };

        mockUseEffect();

        React.useState = jest.fn()
        .mockReturnValueOnce([FileState, setFileState])
        .mockReturnValueOnce([DetailsState, {}])
        
        wrapper = shallow(<ManageShares onClick={ handleDocument() }/>);
        // console.log(wrapper.debug())
    })

    afterEach(() => {
        moxios.uninstall();
    })

    test('render the title of page', () => {
        expect(wrapper.find("h2").text()).toContain("Manage Shares");
        })

    test('render profile picture', () => {
        expect(wrapper.find("ProfilePic")).toBeTruthy;
        })

    test('render the search bar', () => {
        expect(wrapper.find(".search-profile")).toBeTruthy;
        })
    test('render the table', () => {
        expect(wrapper.find("#doc_list")).toBeTruthy;
        })

    test('render the table row', () => {
        expect(wrapper.find(".icons")).toBeTruthy;
        })

    test('render the title of document', () => {
        expect(wrapper.find("#item-names").text()).toContain("Item Name");
        })

    test('Check for the table header - Effective From', () => {
        expect(wrapper.find('.EffectiveFrom').text()).toContain("Effective From");
         })
            
    test('Check for the table header - Effective To', () => {
        expect(wrapper.find('.EffectiveTo').text()).toContain("Effective To");
         })
            
    test('Check for the table header - Action', () => {
         expect(wrapper.find('#action').text()).toContain("Action");
    })
    test('Check for the table header - Action', () => {
        expect(wrapper.find('td').at(0).text()).toContain("Accounts");
    })

    test('Check for the table header - Action', () => {
        expect(wrapper.find('.details-u-s').at(0).text()).toContain("2020-09-18");
    })

    test('Check for the table header - Action', () => {
        expect(wrapper.find('.details-u-s').at(1).text()).toContain("2020-09-18");
    })

    test('test library button' , () => {
        wrapper.find(".file_name-u").simulate("click");
        expect(handleDocument).toBeCalled()
    })

    test('render loading indicator', () => {
        expect(wrapper.find("LoadingIndicator")).toBeTruthy;
    })
    test('render pagination', () => {
        expect(wrapper.find("Pagination")).toBeTruthy;
    })
    // test('test library button' , () => {
    //     wrapper.find("Pagination").simulate("click");
    //     expect(next).toBeCalled()
    // })

})

