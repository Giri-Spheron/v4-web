import { Provider, Viewport } from '@radix-ui/react-toast';

import styled from 'styled-components';
import { layoutMixins } from '@/styles/layoutMixins';

type ElementProps = {
  swipeDirection: 'up' | 'down' | 'left' | 'right';
  children: React.ReactNode;
};

type StyleProps = {
  className?: string;
};

export const ToastArea = ({ swipeDirection, children, className }: ElementProps & StyleProps) => (
  <$ToastArea className={className}>
    <Provider swipeDirection={swipeDirection}>
      {children}
      <Viewport />
    </Provider>
  </$ToastArea>
);

const $ToastArea = styled.aside`
  // Params
  --toasts-gap: 0.5rem;

  // Rules
  ${layoutMixins.scrollArea}
  z-index: 1;

  pointer-events: none;

  > * {
    display: contents;
    pointer-events: none;

    > ol {
      /* display: block; */

      // Radix Toast's DOM order: earliest to latest (???)
      // Radix Toast's focus order: latest to earliest (???)
      // Desired display order: latest to earliest (¯\_(ツ)_/¯)
      display: flex;
      flex-direction: column-reverse;

      pointer-events: none;

      > * {
        pointer-events: initial;
      }
    }
  }
`;
