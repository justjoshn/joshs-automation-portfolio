# Josh's Automation Portfolio

## Overview

This repository contains an automation portfolio showcasing end-to-end (e2e) and API tests for a web application, using Playwright and TypeScript.

## Prerequisites

- [Git](https://git-scm.com/)
- [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm)
- [Yarn](https://yarnpkg.com/)

## Setup and Running Tests

Follow these steps to set up the project and run the tests locally:

1. Clone the repository:

```
git clone https://github.com/justjoshn/joshs-automation-portfolio.git
```

2. Navigate to the project directory:

```
cd joshs-automation-portfolio
```

3. Install and use the correct Node.js version:

```
nvm install
nvm use
```

4. Install dependencies:

```
yarn install
```

5. Install Playwright browsers:

```
yarn playwright install
```

6. Run all tests:

```
yarn test
```

## Running Specific Test Suites

- API tests:

```
yarn test:api
```

- E2E tests:

```
yarn test:e2e
```

- Run tests in headed mode (to see the browser):

```
yarn test:headed
```

- Run tests in debug mode:

```
yarn test:debug
```

- Run tests with Playwright UI:

```
yarn test:ui
```

## Viewing Test Reports

After running the tests, you can find the HTML report in the `playwright-report` directory. Open `playwright-report/index.html` in your browser to view the detailed test results.

## Troubleshooting If you encounter any issues:

1. Ensure you're using the correct Node.js version:

```
node --version
```

It should match the version specified in `.nvmrc`.

2. Clear Playwright browser cache:

```
yarn playwright clear-cache
```

3. Reinstall dependencies:

```
rm -rf node_modules
yarn install
```
