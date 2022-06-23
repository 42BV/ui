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

## React Quill optional dependency

Due to a lot of reports from npm about vulnerabilities in React Quill, we decided to make React Quill an optional dependency.
TextEditor uses React Quill, but not all projects use the TextEditor component. To be able to use the TextEditor component,
you have to install react-quill
`npm i -S react-quill@latest`
and include the css file in your project
`@import '~react-quill/dist/quill.snow.css';` in your CSS or `import 'react-quill/dist/quill.snow.css';` in javascript.

---

## Migration to Bootstrap v5

We finally upgraded to Bootstrap v5! It took a while, but Reactstrap released a new major version with support for Bootstrap v5.
We managed to upgrade without changing user experience or any breaking changes, but Bootstrap renamed a lot of classes, so we had
to release a major version as well.

To upgrade, just run `npm i -S @42.nl/ui@latest reactstrap@latest` and follow the
[Bootstrap migration guide](https://getbootstrap.com/docs/5.0/migration/).

---

## Migration to React Query

In version 3.17 we added support for React Query. We still support React Async, but the library has not been updated for
almost 2 years now, and React Query provides more features we would like to use.

Replacing React Async with React Query in your project is done in a few simple steps:
1. Install React Query by running `npm i -S react-query`
2. In your index.tsx file, add the following:
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
3. In your index.tsx file, wrap the `<App/>` in the provider:
    ```tsx
    <QueryClientProvider client={queryClient}>
        <App/>
    </QueryClientProvider>
    ```
4. Search for all occurrences of `useAsync(...)` in your project and replace them with `useQuery(...)`.
    
`useQuery()` requires the first parameter to be a key. You have to provide a unique key for every useQuery. If you used
the watch property in `useAsync`, you have to add the properties you watched to the key. The key is allowed to be an
array, so something like `useQuery(['users', page, sort], loadUsers)` will refetch once page or sort changed. You are
allowed to pass an entire object to the array, so `useQuery(['users', queryParams], loadUsers)` will work as well.

There are multiple ways to pass parameters to the callback. Per default, an object containing the key is passed to the
callback. The callback would look like this:
```ts
import { QueryFunction } from 'react-query';

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
