import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  async viteFinal(config) {
    config.plugins = (config.plugins ?? []).filter(
      (p) => !(p && 'name' in p && p.name === 'vite:dts')
    );
    return config;
  }
};

export default config;
