import React from 'react';
import * as jarbFinalForm from '@42.nl/jarb-final-form';
import { MarkedAsRequiredLabel } from './MarkedAsRequiredLabel';
import { configure } from '../../../..';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Tooltip from '../../../../core/Tooltip/Tooltip';
import { setConstraints } from '@42.nl/jarb-final-form';

describe('Component: MarkedAsRequiredLabel', () => {
  function setup({
    hasLabel = true,
    customLabel = false
  }: {
    hasLabel?: boolean;
    customLabel?: boolean;
  }) {
    const markedAsRequiredLabel = shallow(
      <MarkedAsRequiredLabel
        validator="Person.firstName"
        label={
          hasLabel ? (
            customLabel ? (
              <Tooltip content="This field is required">First Name</Tooltip>
            ) : (
              'First Name'
            )
          ) : (
            undefined
          )
        }
      />
    );
    return { markedAsRequiredLabel };
  }

  it('should not render anything when label is undefined', () => {
    const { markedAsRequiredLabel } = setup({ hasLabel: false });
    expect(toJson(markedAsRequiredLabel)).toMatchSnapshot(
      'Component: MarkedAsRequiredLabel => should return undefined when label is undefined'
    );
  });

  it('should render label without required mark when showRequiredMarkInLabel is disabled in config', () => {
    configure({ showRequiredMarkInLabel: false });
    const { markedAsRequiredLabel } = setup({});
    expect(toJson(markedAsRequiredLabel)).toMatchSnapshot(
      'Component: MarkedAsRequiredLabel => should render label without required mark when showRequiredMarkInLabel is disabled in config'
    );
    configure({ showRequiredMarkInLabel: true });
  });

  it('should render label without required mark when constraints are not defined', () => {
    jest.spyOn(jarbFinalForm, 'getConstraints').mockReturnValue(undefined);
    const { markedAsRequiredLabel } = setup({});
    expect(toJson(markedAsRequiredLabel)).toMatchSnapshot(
      'Component: MarkedAsRequiredLabel => should render label without required mark when constraints are not defined'
    );
  });

  it('should render label without required mark when constraints does not include field validator', () => {
    jest.spyOn(jarbFinalForm, 'getConstraints').mockReturnValue({ User: {} });
    const { markedAsRequiredLabel } = setup({});
    expect(toJson(markedAsRequiredLabel)).toMatchSnapshot(
      'Component: MarkedAsRequiredLabel => should render label without required mark when constraints does not include field validator'
    );
  });

  it('should render label without required mark when constraints include field validator but field is not required', () => {
    jest.spyOn(jarbFinalForm, 'getConstraints').mockReturnValue({
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
    const { markedAsRequiredLabel } = setup({});
    expect(toJson(markedAsRequiredLabel)).toMatchSnapshot(
      'Component: MarkedAsRequiredLabel => should render label without required mark when constraints include field validator but field is not required'
    );
  });

  it('should render label without required mark when label is a custom component', () => {
    jest.spyOn(jarbFinalForm, 'getConstraints').mockReturnValue({
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
    const { markedAsRequiredLabel } = setup({ customLabel: true });
    expect(toJson(markedAsRequiredLabel)).toMatchSnapshot(
      'Component: MarkedAsRequiredLabel => should render label without required mark when label is a custom component'
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
    const { markedAsRequiredLabel } = setup({});
    expect(toJson(markedAsRequiredLabel)).toMatchSnapshot(
      'Component: MarkedAsRequiredLabel => should render label with required mark when constraints include field validator'
    );
  });
});
