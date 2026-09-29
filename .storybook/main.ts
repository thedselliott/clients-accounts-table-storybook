import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials', // includes the Controls, Actions, Docs, Viewport panels
    '@storybook/addon-interactions',
    '@storybook/addon-a11y', // runs axe-core against every story — surfaces the contrast/aria issues in the a11y checklist automatically
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};

export default config;
