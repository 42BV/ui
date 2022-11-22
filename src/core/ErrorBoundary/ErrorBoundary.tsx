import React from 'react';
import { ContentState } from '../ContentState/ContentState';
import { t } from '../../utilities/translation/translation';
import { WithChildren } from '../types';

type ErrorState = {
  hasError: boolean;
};

type Props = Partial<Omit<HTMLElement, 'children'>> & {
  text?: {
    error: string;
  };
} & WithChildren<React.ReactNode>;

/**
 * Only class-components can serve as an ErrorBoundary. As such, this cannot be rewritten in a functional manner.
 * {@link https://reactjs.org/docs/error-boundaries.html#introducing-error-boundaries:~:text=Only%20class%20components%20can%20be%20error%20boundaries ReactJS.org}
 */
export class ErrorBoundary extends React.Component<Props, ErrorState> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ContentState
          mode="error"
          title={t({
            key: 'ErrorBoundary.ERROR.TITLE',
            fallback: 'Oops something went wrong!',
            overrideText: this.props.text?.error
          })}
        />
      );
    }

    return this.props.children;
  }
}
