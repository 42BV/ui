import React from 'react';
import ContentState from '../ContentState/ContentState';
import { t } from '../../utilities/translation/translation';

type ErrorState = {
  hasError: boolean;
};

type Props = {
  text?: {
    error: string;
  }
}

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
