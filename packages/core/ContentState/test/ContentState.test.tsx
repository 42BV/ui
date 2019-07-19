import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import ContentState from '../src/ContentState';

describe('Component: ContentStateIcon', () => {
  describe('ui', () => {
    test('empty', () => {
      const contentState = shallow(
        <ContentState mode="empty" title="title" subTitle="subtitle" />
      );

      expect(toJson(contentState)).toMatchSnapshot(
        'Component: ContentStateIcon => empty'
      );
    });

    test('no-results', () => {
      const contentState = shallow(
        <ContentState mode="no-results" title="title" subTitle="subtitle" />
      );

      expect(toJson(contentState)).toMatchSnapshot(
        'Component: ContentStateIcon => no-results'
      );
    });

    test('error', () => {
      const contentState = shallow(
        <ContentState mode="error" title="title" subTitle="subtitle" />
      );

      expect(toJson(contentState)).toMatchSnapshot(
        'Component: ContentStateIcon => error'
      );
    });

    test('with extra className', () => {
      const contentState = shallow(
        <ContentState
          className="extra-class"
          mode="error"
          title="title"
          subTitle="subtitle"
        />
      );

      expect(contentState.find('.extra-class').length).toBe(1);
    });

    test('with children', () => {
      const contentState = shallow(
        <ContentState mode="error" title="title" subTitle="subtitle">
          <p>Children</p>
        </ContentState>
      );

      expect(contentState.contains(<p>Children</p>)).toBe(true);
    });
  });
});
