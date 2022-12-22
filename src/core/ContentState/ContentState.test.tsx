import React from 'react';
import { render, screen } from '@testing-library/react';

import { ContentState } from './ContentState';

describe('Component: ContentStateIcon', () => {
  describe('ui', () => {
    test('empty', () => {
      const { container } = render(
        <ContentState mode="empty" title="title" subTitle="subtitle" />
      );

      expect(container).toMatchSnapshot();
    });

    test('no-results', () => {
      const { container } = render(
        <ContentState mode="no-results" title="title" subTitle="subtitle" />
      );

      expect(container).toMatchSnapshot();
    });

    test('error', () => {
      const { container } = render(
        <ContentState mode="error" title="title" subTitle="subtitle" />
      );

      expect(container).toMatchSnapshot();
    });

    test('loading', () => {
      const { container } = render(
        <ContentState mode="loading" title="Loading..." />
      );

      expect(container).toMatchSnapshot();
    });

    test('with extra className', () => {
      const { container } = render(
        <ContentState
          className="extra-class"
          mode="error"
          title="title"
          subTitle="subtitle"
        />
      );

      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild.classList.contains('extra-class')).toBe(true);
    });

    test('with children', async () => {
      expect.assertions(1);

      const { container } = render(
        <ContentState mode="error" title="title" subTitle="subtitle">
          <p>Children</p>
        </ContentState>
      );

      await screen.findByText('Children');
      expect(container).toMatchSnapshot();
    });
  });
});
