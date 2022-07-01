import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import ContentState from './ContentState';

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

      expect(container.firstChild).toHaveClass('extra-class');
    });

    test('with children', () => {
      const { container } = render(
        <ContentState mode="error" title="title" subTitle="subtitle">
          <p>Children</p>
        </ContentState>
      );

      expect(screen.getByText('Children')).toBeInTheDocument();
      expect(container).toMatchSnapshot();
    });
  });
});
