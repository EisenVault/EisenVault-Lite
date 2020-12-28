import PrivateRoute from './PrivateRoutes';
import React from 'react';
import { getToken } from './Common';

import EnzymeAdapter from 'enzyme-adapter-react-16';
import Enzyme, { mount } from 'enzyme';
import { MemoryRouter } from 'react-router';

Enzyme.configure({ adapter: new EnzymeAdapter() })

describe('Testing Private routes', () => {
  test('should render component if user has been authenticated', () => {
    const AComponent = () => <div>AComponent</div>;
    const props = getToken();

    const enzymeWrapper = mount(
      <MemoryRouter initialEntries={[props.path]}>
        <PrivateRoute ownProps={props} />
      </MemoryRouter>
    );

    expect(enzymeWrapper.exists(AComponent)).toBe(true);
  });

  test('should redirect if user is not authenticated', () => {
    const AComponent = () => <div>AComponent</div>;
    const props = { path: '/aprivatepath', component: AComponent };

    const enzymeWrapper = mount(
      <MemoryRouter initialEntries={[props.path]}>
        <PrivateRoute ownProps={props} />
      </MemoryRouter>
    );
    const history = enzymeWrapper.find('Router').prop('history');
    expect(history.location.pathname).toBe('/');
  });
});