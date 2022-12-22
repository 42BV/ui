import React, { useState } from 'react';

import { Tabs } from './Tabs';

import { Form } from 'react-final-form';
import { Tab } from './Tab/Tab';
import { Button } from '../Button/Button';
import { JarbInput } from '../../form/Input/Input';
import { JarbTextarea } from '../../form/Textarea/Textarea';
import { Card } from '../Card/Card';
import { sleep } from '../../story-utils';

export default {
  title: 'core/Tabs',

  parameters: {
    component: Tabs
  }
};

const DefaultStory = () => {
  type AvailableTabs = 'info' | 'testing' | 'details';
  const [activeTab, setActiveTab] = useState<AvailableTabs>('info');
  return (
    <Card>
      <Tabs>
        <Tab
          onClick={() => setActiveTab('info')}
          active={activeTab === 'info'}
          label="info"
        >
          {() => <p>You should be able to use these tabs</p>}
        </Tab>
        <Tab
          onClick={() => setActiveTab('testing')}
          active={activeTab === 'testing'}
          label="testing"
        >
          {() => <p>This is suspended content</p>}
        </Tab>
        <Tab
          onClick={() => setActiveTab('details')}
          active={activeTab === 'details'}
          label="details"
        >
          {() => <Button color="primary">This is a button</Button>}
        </Tab>
      </Tabs>
    </Card>
  );
};

export const Default = {
  render: DefaultStory,
  name: 'default'
};

const DisabledStory = () => {
  type AvailableTabs = 'info' | 'testing' | 'details';
  const [activeTab, setActiveTab] = useState<AvailableTabs>('info');
  return (
    <Card>
      <Tabs>
        <Tab
          onClick={() => setActiveTab('info')}
          active={activeTab === 'info'}
          label="info"
          disabled={false}
        >
          {() => <p>You should be able to use these tabs</p>}
        </Tab>
        <Tab
          onClick={() => setActiveTab('testing')}
          active={activeTab === 'testing'}
          label="testing"
          disabled={true}
        >
          {() => <p>This content is suspended</p>}
        </Tab>
        <Tab
          onClick={() => setActiveTab('details')}
          active={activeTab === 'details'}
          label="details"
          disabled={false}
        >
          {() => <Button color="primary">This is a button</Button>}
        </Tab>
      </Tabs>
    </Card>
  );
};

export const Disabled = {
  render: DisabledStory,
  name: 'disabled'
};

const ShowHideStory = () => {
  type AvailableTabs = 'info' | 'testing' | 'details';
  const [activeTab, setActiveTab] = useState<AvailableTabs>('info');
  return (
    <Card>
      <p>
        You can leverage the show property to do things like permission checks
        to hide the tab if the user is not allowed to see the content.
      </p>
      <Tabs>
        <Tab
          onClick={() => setActiveTab('info')}
          active={activeTab === 'info'}
          label="info"
          show={() => true}
        >
          {() => <p>You should be able to use these tabs</p>}
        </Tab>
        <Tab
          onClick={() => setActiveTab('testing')}
          active={activeTab === 'testing'}
          label="testing"
          show={() => true}
        >
          {() => <p>This content is suspended</p>}
        </Tab>
        <Tab
          onClick={() => setActiveTab('details')}
          active={activeTab === 'details'}
          label="details"
          show={() => false}
        >
          {() => <Button color="primary">This is a button</Button>}
        </Tab>
      </Tabs>
    </Card>
  );
};

export const ShowHide = {
  render: ShowHideStory,
  name: 'show/hide'
};

const WithIconsStory = () => {
  type AvailableTabs = 'info' | 'testing' | 'details';
  const [activeTab, setActiveTab] = useState<AvailableTabs>('info');
  return (
    <Card>
      <Tabs>
        <Tab
          onClick={() => setActiveTab('info')}
          active={activeTab === 'info'}
          label="info"
          icon="info"
          iconColor="primary"
        >
          {() => <p>You should be able to use these tabs</p>}
        </Tab>
        <Tab
          onClick={() => setActiveTab('testing')}
          active={activeTab === 'testing'}
          label="testing"
          icon="warning"
          iconColor="warning"
        >
          {() => <p>This content is suspended</p>}
        </Tab>
        <Tab
          onClick={() => setActiveTab('details')}
          active={activeTab === 'details'}
          label="details"
          icon="keyboard_hide"
          iconColor="danger"
        >
          {() => <Button color="primary">This is a button</Button>}
        </Tab>
      </Tabs>
    </Card>
  );
};

export const WithIcons = {
  render: WithIconsStory,
  name: 'with icons'
};

const WithinAFormStory = () => {
  type AvailableTabs = 'info' | 'content';
  const [activeTab, setActiveTab] = useState<AvailableTabs>('info');
  const [triedToSubmit, setTriedToSubmit] = useState(false);
  return (
    <Form
      onSubmit={() => sleep(1000)}
      render={({ handleSubmit, submitting, errors }) => (
        <Card>
          <p>
            Hide inactive tabs using CSS when the tabs are used in a final-form.
            When all form elements are in the DOM, they will all participate in
            the form validation. This way, form elements across all tabs are
            checked.
          </p>
          <Tabs hideInactiveTabsBy="CSS">
            <Tab
              label="info"
              onClick={() => setActiveTab('info')}
              active={activeTab === 'info'}
              icon={
                errors && (errors.username || errors.password) && triedToSubmit
                  ? 'warning'
                  : undefined
              }
              iconColor="danger"
            >
              {() => (
                <>
                  <JarbInput
                    jarb={{
                      validator: '',
                      label: 'username'
                    }}
                    validators={[isRequired]}
                    id="username"
                    label="Username"
                    name="username"
                  />
                  <JarbInput
                    jarb={{
                      validator: '',
                      label: 'password'
                    }}
                    validators={[isRequired]}
                    id="password"
                    label="Password"
                    type="password"
                    name="password"
                  />
                </>
              )}
            </Tab>
            <Tab
              label="content"
              onClick={() => setActiveTab('content')}
              active={activeTab === 'content'}
              icon={
                errors && errors.content && triedToSubmit
                  ? 'warning'
                  : undefined
              }
              iconColor="danger"
            >
              {() => (
                <JarbTextarea
                  jarb={{
                    validator: '',
                    label: 'content'
                  }}
                  validators={[isRequired]}
                  id="content"
                  label="Content"
                  name="content"
                />
              )}
            </Tab>
          </Tabs>
          <Button
            inProgress={submitting}
            onClick={() => {
              setTriedToSubmit(true);
              handleSubmit();
            }}
          >
            Submit
          </Button>
        </Card>
      )}
    />
  );
};

export const WithinAForm = {
  render: WithinAFormStory,
  name: 'within a form'
};

function isRequired(value?: any) {
  return value ? undefined : 'This field is required';
}
