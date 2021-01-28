import React from 'react';
import Enzyme, {shallow, mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import moxios from 'moxios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile,faFolder,faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import TrashDisplay from './TrashDisplay';
import { Pagination } from "../Pagination/Pagination";
import NestedToolTip from '../UI/popup';

Enzyme.configure({ adapter: new EnzymeAdapter() })

let wrapper = shallow(<TrashDisplay />)




describe("mocking axios request",()=>{
    beforeEach(function () {
        // import and pass your custom axios instance to this method
        moxios.install()
        moxios.stubRequest(`https://systest.eisenvault.net/alfresco/api/-default-/public/alfresco/versions/1/deleted-nodes?skipCount=0&maxItems=50`, {
            status: 200,
            response: {}
      })
    });
    afterEach( () => {
        moxios.uninstall();
    });

    test('fetch documents' , async () => {
        const response = {};
        const TrashFileState = wrapper.find('TrashFileState');
        const setTrashFileState=wrapper.find('setTrashFileState')
        console.log(TrashFileState);
        console.log(wrapper)
       
            const newState = setTrashFileState;
            wrapper.update();
            expect(newState).toEqual(response); 
    });
    test("doesn't break with an empty array",()=>{
        const wrapper=Enzyme.shallow(<TrashDisplay setTrashFileState={[]}/>)
        expect(wrapper.find("td")).toHaveLength(0);
    })
    
    test('Delete documents' , async () => {
        const response = {};
        const TrashFileState = wrapper.find('TrashFileState');
            const newState = TrashFileState;
            wrapper.update();
            expect(newState).toEqual(response); 
    });

    })

    describe("mocking axios request for default delete operation",()=>{
        beforeEach(function () {
            // import and pass your custom axios instance to this method
            moxios.install()
            moxios.stubRequest(`https://systest.eisenvault.net/alfresco/s/api/archive/workspace/SpacesStore`, {
                status: 200,
                response: {}
          })
        });
        
    test('Default Delete', async ()=>{
        const response={};
        const TrashFileState = wrapper.find('TrashFileState');
        const setTrashFileState=wrapper.find('setTrashFileState')
            const newState = setTrashFileState;
            wrapper.update();
            expect(newState).toEqual(response); 
     })
     afterEach( () => {
        moxios.uninstall();
    });
    test("was api call successfull",(done)=>{

    })    
})
// test('new item is added to the UI when the form is successfully submitted', (done) => {
//   // Instead of making a real API call, mock the helper to return a
//   // resolved promise with the data that would come back from the API
//   submitNewItem.mockResolvedValueOnce({ id: 14, title: 'Gucci sneakers' })

//   const component = mount(<Adder />)
//   const preventDefault = jest.fn()

//   component
//     .find('[data-testid="addform-form"]')
//     .simulate('submit', { preventDefault })

//   expect(preventDefault).toHaveBeenCalledTimes(1)

//   setImmediate(() => {
//     // within `setImmediate` all of the promises have been exhausted
//     component.update()
//     expect(component.find('[data-testid="adder-items"]')).toHaveLength(1)
//     // have to call done here to let Jest know the test is done
//     done()
//   })
// })




    test("it should have the input element(checkbox)",()=>{
        expect(
            wrapper.containsMatchingElement(
              <input />
            )
          ).toBe(true);
    })
    describe('the user populates the input', () => {
        const item = 'checked';
        beforeEach(() => {
          const input = wrapper.find('input').first();
          input.simulate('change', {
            target: { value: item }
          })
        });})



describe("testing render components",()=>{
    test("renders withouth error",()=>{
        expect(wrapper.find("#second_section").length).toBe(1);
    })

    test("test title of the page",()=>{
        expect(wrapper.find("h2").text()).toContain("Trash")
    })
    test('get search profile',()=>{
        expect(wrapper.find(".search-profile")).toBeTruthy
    })
    test('render profile picture', () => {
        expect(wrapper.find(".title")).toBeTruthy;
    })

    test('check for item name heading',()=>{
        expect(wrapper.find("#item_name").text()).toContain("Item Name");
    })

    test('check for Uploaded on heading',()=>{
        expect(wrapper.find("#created").text()).toContain("Created on");
    })
    test("check for deleted on heading",()=>{
        expect(wrapper.find("#deleted").text()).toContain("Deleted on")
    })
    
})


describe('<TestComponent />', () => {
    let wrapper;
    
    beforeEach(() => {
        
        wrapper =mount(<TrashDisplay />);
    });
    const setTrashFileState = jest.fn();
    const setPaginationDefault=jest.fn()
    const useStateSpy = jest.spyOn(React, 'useState')
    useStateSpy.mockImplementation((TrashFileState) => [TrashFileState, setTrashFileState]);
    useStateSpy.mockImplementation((paginationDefualt) => [paginationDefualt, setPaginationDefault]);
    
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('testing components', () => {
      test('check for pagination component', () => {
       expect(wrapper.find('Pagination').length).toBe(1)
      });

      test('check for LoadingIndicator',()=>{
        expect(wrapper.find('LoadingIndicator').length).toBe(1)

      })
      test('check for NestedToolTip',()=>{
        expect(wrapper.find('NestedToolTip').length).toBe(1)
      })
    });});


describe("test for click events",()=>{
  test('check click event on file name',()=>{
     const handleDocument = jest.fn();
     const wrapper = mount(<td className="file_name-u"
     onClick={()=>{handleDocument()}}></td>);
     wrapper.find('.file_name-u').at(0).simulate('click',{
        target: { value: "file",
                    id: "id112",
                title: "title" }
      });
     wrapper.update();
     expect(handleDocument).toBeCalled();
 });
})


// test('should call fetch on mount if prop: reloadData is true', () => {
//   const RestoreFileByIds=jest.fn()
//   const wrapper = mount(
//       <Router>
//         <th id="action-trash"><NestedToolTip restored={RestoreFileByIds}/></th>
//       </Router>

//   )
//   wrapper.find('#action-trash').at(0).simulate()

//   expect().toBe('Side-drawer open')
// })



// test('should render Action and its options',()=>{
//     const ActionWrapper=shallow(<NestedToolTip/>);
//     const wrapper=shallow(<TrashDisplay/>);
//     expect(wrapper).toContain("ActionWrapper")
// })

































