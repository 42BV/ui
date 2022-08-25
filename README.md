<p style="text-align:center">
  <a href="https://www.42.nl">
    <img alt="42 BV" src="https://42bv.github.io/ui/assets/img/logo.svg" width="60">
  </a>
</p>

<p style="text-align:center">
  Components that are commonly used within 42.nl products.
</p>

<p style="text-align:center">
    <a href="https://travis-ci.org/42BV/ui/">
      <img alt="Build status" src="https://travis-ci.org/42BV/ui.svg?branch=master" />
    </a>
    <a href="https://codecov.io/gh/42BV/ui">
      <img alt="Coverage" src="https://codecov.io/gh/42BV/ui/branch/master/graph/badge.svg" />
    </a>
    <a href="https://greenkeeper.io/">
      <img alt="Greenkeeper" src="https://badges.greenkeeper.io/42BV/ui.svg" />
    </a>
</p>

---

## Migrate to v5

The major reason we released a new major version of this library, is because we changed a lot of dependencies to become
optional. We explain that more in detail below. We also changed the DateTimeInput to always send the value to onChange
whether it is a valid date or not. This gives JarbDateTimeInput the ability to validate the date and display the correct
error messages. It also gives you as a developer more control over the value. We also removed the mask option from the input
as it is not required for the DateTimeInput anymore and the library doesn't support React v17+.

Other than that, we also changed the label of form elements to be required and added a hiddenLabel property to visually
hide the label. This was done together with other improvements to a lot of components to comply with the accessibility guidelines.
We should now be [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) compliant. If you find any problems with accessibility,
please create an issue, so we can work on it.

For forms, we also added Field components like the Jarb components, but without JaRB. This simplifies usage of form elements
in forms for fields that don't have a JaRB validator or in projects that don't supply JaRB validation. In addition to that,
we changed the label for Jarb components to default to the value from `jarb.label` so you only have to specify the label once.
If you want a custom label or a if you want to use a React component as label, you can still use the label property.

We removed the Popover component as it was a replica of the Tooltip component with a different style. We encourage using the
Modal with more complex content as the accessibility and user experience are better than navigable content in a popover.

With the new release, we now support React Query v4. Be sure to check their
[migration guide](https://tanstack.com/query/v4/docs/guides/migrating-to-react-query-4) to keep your project up-to-date.
We still support React Query v3 and React Async, so if you don't have time to update your project, you don't have to worry
about using v5 of this library.

Bootstrap has also been updated to v5.2. Although it doesn't break your project, please check out their
[migration guide](https://getbootstrap.com/docs/5.2/migration/) for changes and new features.

We also introduced a new [CopyToClipboard](https://42bv.github.io/ui/storybook/?path=/story/core-copytoclipboard) component,
the [EpicPagination](https://42bv.github.io/ui/storybook/?path=/story/core-epicpagination) component (different layout),
added a dropdown to Pagination to allow the user to determine the page size, and fixed user experience issues with the
ImageUpload component.

Enzyme was last updated 3 years ago and only worked with React 16/17 using adapters. There is no adapter for React 18,
so we had to replace it with [React Testing Library](https://testing-library.com/). We still support React 17, but for
development we now use the most recent version of React. This also gave us the ability to update some other dependencies.

### Optional dependencies

We have a lot of dependencies making our dependency tree pretty big, while a lot of those dependencies are only used in
a few or even only in a single component. If you don't use that component(s) in your project, this library would
unnecessarily increase the size of your dependency tree and slow down the installation and build process.

We moved those dependencies to the optionalDependencies in our package.json, allowing you as developer to decide whether
you need those dependencies or not. With an alert message displayed for every component/feature in our
[Storybook](https://42bv.github.io/ui/storybook/), we made it easier for you to figure out which dependencies you have
to add to your project. If you still miss a dependency, you'll get an error while compiling or in the console stating
you miss a dependency, so you should not be able to deploy with missing dependencies.

---

## Migration to Bootstrap v5

We finally upgraded to Bootstrap v5! It took a while, but Reactstrap released a new major version with support for
Bootstrap v5. We managed to upgrade without changing user experience or any breaking changes, but Bootstrap renamed a
lot of classes, so we had to release a major version as well.

To upgrade, just run `npm i -S @42.nl/ui@latest reactstrap@latest` and follow the
[Bootstrap migration guide](https://getbootstrap.com/docs/5.0/migration/).

---

## Migration to React Query

In version 3.17 we added support for React Query. We still support React Async, but the library has not been updated for
almost 2 years now, and React Query provides more features we would like to use.

Replacing React Async with React Query in your project is done in a few simple steps:

1.  Install React Query by running `npm i -S @tanstack/react-query`

2.  In your index.tsx file, add the following:
    ```ts
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                // These options will make React Query work similar to React Async
                retry: false,
                refetchOnWindowFocus: false,
                cacheTime: 0
            }
        }
    });
    ```
    
3.  In your index.tsx file, wrap the `<App/>` in the provider:
    ```tsx
    <QueryClientProvider client={queryClient}>
        <App/>
    </QueryClientProvider>
    ```
    
4.  Search for all occurrences of `useAsync(...)` in your project and replace them with `useQuery(...)`.
    
`useQuery()` requires the first parameter to be a key. You have to provide a unique key for every useQuery. If you used
the watch property in `useAsync`, you have to add the properties you watched to the key. The key is allowed to be an
array, so something like `useQuery(['users', page, sort], loadUsers)` will refetch once page or sort changed. You are
allowed to pass an entire object to the array, so `useQuery(['users', queryParams], loadUsers)` will work as well.

There are multiple ways to pass parameters to the callback. Per default, an object containing the key is passed to the
callback. The callback would look like this:
```ts
import { QueryFunction } from '@tanstack/react-query';

...

function loadUsers({ queryKey }: QueryFunctionContext) {
    // The first item in the array is ignored as it contains the unique key
    const [ , page, sort ] = queryKey;
    ...
}

...
```
If you specify the parameters yourself, you have to use a closure like this:
```ts
const users = useQuery(['users', page, sort], () => loadUsers({ page, sort }));
```
Don't forget to add all parameters to the key as well, otherwise when one of the parameters changes, the query will not
be called and the result will not be updated.

For more details about how to use React Query, we refer you to [their docs](https://react-query.tanstack.com/overview).

---

## Installation

### Setup

```bash
# with yarn
yarn add @42.nl/ui

# with npm
npm i @42.nl/ui --save
```

## Contributing

> Detailled steps can be found at https://42bv.github.io/ui.

### Setup

1. Ensure you have Node.js 10.13+ installed.
2. Git clone the repository.
3. From the root of the repository, run `npm i` to install the dependencies required for development.

### Testing

First follow the build instructions above. Then to run both the linters and tests, use:

```bash
npm test
```

Or to run them separately, use:

```bash
npm run lint
```

```bash
npm run test:ts
```

```bash
npm run test:coverage
```

### Development

We use [Storybook](https://42bv.github.io/ui/storybook/) to test our components
during development. To start up a local storybook, run `npm start` from the root directory.

Also make sure the test coverage is 100%. To run the tests automatically on every change, run `npm run test:watch` from the root directory.

If all tests pass, the test coverage is 100% and you want to test the changes in
a project of your choice, you can create a local release.

#### Local release

To prevent multiple prelease publishes for a single feature, we recommend using
[Verdaccio](https://verdaccio.org/). Verdaccio enables you to spin up
a local NPM registry which in turn allows us to publish multiple versions for testing purposes without polluting the version in NPM.

> We recommend the Docker approach instead of locally installing
> Verdaccio. If you do not want to use Docker, refer to the Verdaccio
> documentation.

To publish to the Verdaccio registry run `npm run dev:publish` this
will spin up Verdaccio and publish.

You can view Verdaccio here: `http://localhost:4873/` it should after
a successful dev publish show the packages here.

To verify the release, install `@42.nl/ui` from the Verdaccio registry in a project of your choice
by running: `npm install --registry http://localhost:4873`.

Now you can test the package locally without a publish to the actual
NPM registry.
