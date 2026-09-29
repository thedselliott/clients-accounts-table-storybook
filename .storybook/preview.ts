import type { Preview } from '@storybook/react';
import '../src/tokens.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
      },
    },
    backgrounds: {
      default: 'surface',
      values: [{ name: 'surface', value: '#FEF7FF' }],
    },
  },
  tags: ['autodocs'],
};

export default preview;
