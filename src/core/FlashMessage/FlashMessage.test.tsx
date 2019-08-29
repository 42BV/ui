/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as reactFlashMessages from '@42.nl/react-flash-messages';
import FlashMessage from './FlashMessage';

describe('Component: FlashMessage', () => {
  let flashMessage: ShallowWrapper;

  function setup({
    messages
  }: {
    messages: reactFlashMessages.FlashMessageConfig<any>[];
  }) {
    reactFlashMessages.flashMessageService.clearFlashMessages();
    messages.forEach(m => reactFlashMessages.addFlashMessage(m));
    jest.spyOn(reactFlashMessages, 'removeFlashMessage');
    flashMessage = shallow(<FlashMessage />);
  }

  test('ui', () => {
    setup({
      messages: [
        {
          type: 'INFO',
          text: 'Epic info',
          onClick: jest.fn(),
          duration: 5000,
          data: { age: 15 }
        }
      ]
    });
    expect(toJson(flashMessage)).toMatchSnapshot(
      'Component: FlashMessage => ui'
    );
  });

  test('empty messages array', () => {
    setup({ messages: [] });
    expect(toJson(flashMessage)).toMatchSnapshot(
      'Component: FlashMessage => empty messages array'
    );
  });

  test('message types', () => {
    setup({
      messages: [
        {
          type: 'INFO',
          text: 'text',
          onClick: jest.fn(),
          duration: 5000,
          data: { age: 1 }
        },
        {
          type: 'SUCCESS',
          text: 'text',
          onClick: jest.fn(),
          duration: 5000,
          data: { age: 1 }
        },
        {
          type: 'WARNING',
          text: 'text',
          onClick: jest.fn(),
          duration: 5000,
          data: { age: 1 }
        },
        {
          type: 'ERROR',
          text: 'text',
          onClick: jest.fn(),
          duration: 5000,
          data: { age: 1 }
        },
        {
          type: 'APOCALYPSE',
          text: 'text',
          onClick: jest.fn(),
          duration: 5000,
          data: { age: 1 }
        }
      ]
    });
    expect(toJson(flashMessage)).toMatchSnapshot(
      'Component: FlashMessage => message types'
    );
  });

  test('onFlashMessageClick', () => {
    const onClickSpy = jest.fn();

    const message = {
      id: 42,
      type: 'INFO',
      text: 'Epic info',
      onClick: onClickSpy,
      duration: 5000,
      data: { age: 15 }
    };

    setup({ messages: [message] });

    flashMessage
      .find('Alert')
      .props()
      // @ts-ignore
      .toggle();

    expect(onClickSpy).toHaveBeenCalledTimes(1);
    expect(onClickSpy).toHaveBeenCalledWith(message);

    expect(reactFlashMessages.removeFlashMessage).toHaveBeenCalledTimes(1);
    expect(reactFlashMessages.removeFlashMessage).toHaveBeenCalledWith(message);
  });
});
