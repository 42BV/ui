import React from 'react';
import { Button } from 'reactstrap';

import { ContentState } from './ContentState';

export default {
  title: 'core/ContentState',

  parameters: {
    component: ContentState
  }
};

const EmptyStory = () => {
  return (
    <ContentState
      mode="empty"
      title="Accounts"
      subTitle="There are no accounts yet"
    />
  );
};

export const Empty = {
  render: EmptyStory,
  name: 'empty'
};

const ErrorStory = () => {
  return (
    <ContentState
      mode="error"
      title="Bikes"
      subTitle="All bikes are destroyed"
    />
  );
};

export const Error = {
  render: ErrorStory,
  name: 'error'
};

const NoResultsStory = () => {
  return (
    <ContentState
      mode="no-results"
      title="Persons"
      subTitle="No persons found matching criteria"
    />
  );
};

export const NoResults = {
  render: NoResultsStory,
  name: 'no-results'
};

const LoadingStory = () => {
  return <ContentState mode="loading" title="Loading..." />;
};

export const Loading = {
  render: LoadingStory,
  name: 'loading'
};

const WithChildrenStory = () => {
  return (
    <ContentState mode="empty" title="Bikes" subTitle="There are no bikes yet">
      <Button color="info">Add bike</Button>
    </ContentState>
  );
};

export const WithChildren = {
  render: WithChildrenStory,
  name: 'with children'
};
