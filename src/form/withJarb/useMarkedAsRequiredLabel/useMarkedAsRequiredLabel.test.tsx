import React from 'react';
import { setConstraints } from '@42.nl/jarb-final-form';
import { configure } from '../../../config/config';
import Tooltip from '../../../core/Tooltip/Tooltip';
import { useMarkedAsRequiredLabel } from './useMarkedAsRequiredLabel';
import { renderHook } from '@testing-library/react-hooks';

describe('Hook: useMarkedAsRequiredLabel', () => {
  function setup({
    hasLabel = true,
    customLabel = false
  }: {
    hasLabel?: boolean;
    customLabel?: boolean;
  }) {
    const { result } = renderHook(() =>
      useMarkedAsRequiredLabel({
        label: hasLabel ? (
          customLabel ? (
            <Tooltip content="This field is required">First Name</Tooltip>
          ) : (
            'First Name'
          )
        ) : (
          undefined
        ),
        validator: 'Person.firstName'
      })
    );

    return { result };
  }

  it('should not render anything when label is undefined', () => {
    const { result } = setup({ hasLabel: false });
    expect(result.current).toBe(undefined);
  });

  it('should render label without required mark when showRequiredMarkInLabel is disabled in config', () => {
    configure({ showRequiredMarkInLabel: false });
    const { result } = setup({});
    expect(result.current).toBe('First Name');
    configure({ showRequiredMarkInLabel: true });
  });

  it('should render label without required mark when constraints are not defined', () => {
    setConstraints(undefined);
    const { result } = setup({});
    expect(result.current).toBe('First Name');
  });

  it('should render label without required mark when constraints does not include field validator', () => {
    setConstraints({ User: {} });
    const { result } = setup({});
    expect(result.current).toBe('First Name');
  });

  it('should render label without required mark when constraints include field validator but field is not required', () => {
    setConstraints({
      Person: {
        firstName: {
          javaType: 'java.lang.String',
          types: ['text'],
          required: false,
          minimumLength: null,
          maximumLength: 50,
          fractionLength: null,
          radix: null,
          pattern: null,
          min: null,
          max: null,
          name: 'name'
        }
      }
    });
    const { result } = setup({});
    expect(result.current).toBe('First Name');
  });

  it('should render label without required mark when label is a custom component', () => {
    setConstraints({
      Person: {
        firstName: {
          javaType: 'java.lang.String',
          types: ['text'],
          required: false,
          minimumLength: null,
          maximumLength: 50,
          fractionLength: null,
          radix: null,
          pattern: null,
          min: null,
          max: null,
          name: 'name'
        }
      }
    });
    const { result } = setup({ customLabel: true });
    expect(result.current).toMatchSnapshot(
      'Hook: useMarkedAsRequiredLabel => should render label without required mark when label is a custom component'
    );
  });

  it('should render label with required mark when constraints include field validator', () => {
    setConstraints({
      Person: {
        firstName: {
          javaType: 'java.lang.String',
          types: ['text'],
          required: true,
          minimumLength: null,
          maximumLength: 50,
          fractionLength: null,
          radix: null,
          pattern: null,
          min: null,
          max: null,
          name: 'name'
        }
      }
    });
    const { result } = setup({});
    expect(result.current).toMatchSnapshot(
      'Hook: useMarkedAsRequiredLabel => should render label with required mark when constraints include field validator'
    );
  });
});
