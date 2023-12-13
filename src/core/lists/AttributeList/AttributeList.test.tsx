import { render } from '@testing-library/react';

import { AttributeList } from './AttributeList';
import { AttributeView } from '../AttributeView/AttributeView';

describe('Component: AttributeList', () => {
  test('ui', () => {
    const { container } = render(
      <AttributeList>
        <AttributeView label="Name">42 BV</AttributeView>
        <AttributeView label="City">Zoetermeer</AttributeView>
        <AttributeView label="Country">Netherlands</AttributeView>
      </AttributeList>
    );

    expect(container).toMatchSnapshot();
  });
});
