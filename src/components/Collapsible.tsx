import styled, { css, keyframes, type AnyStyledComponent } from 'styled-components';
import { Root, Trigger, Content } from '@radix-ui/react-collapsible';

import { popoverMixins } from '@/styles/popoverMixins';

import { HorizontalSeparatorFiller } from '@/components/Separator';
import { Icon, IconName } from '@/components/Icon';

type ElementProps = {
  defaultOpen?: boolean;
  disabled?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  label: React.ReactNode;
  triggerIcon?: IconName;
  children: React.ReactNode;
};

type StyleProps = {
  className?: string;
  transitionDuration?: number;
  triggerIconSide?: 'left' | 'right';
  fullWidth?: boolean;
};

export const Collapsible = ({
  defaultOpen = false,
  disabled,
  open,
  onOpenChange,
  label,
  children,
  transitionDuration,
  triggerIcon = IconName.Caret,
  triggerIconSide = 'left',
  fullWidth,
  className,
}: ElementProps & StyleProps) => (
  <Styled.Root defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
    <Styled.Trigger className={className} disabled={disabled}>
      {triggerIconSide === 'right' && (
        <>
          {label}
          {fullWidth && <HorizontalSeparatorFiller />}
        </>
      )}

      <Styled.TriggerIcon>
        <Icon iconName={triggerIcon} />
      </Styled.TriggerIcon>
      {triggerIconSide === 'left' && (
        <>
          {fullWidth && <HorizontalSeparatorFiller />}
          {label}
        </>
      )}
    </Styled.Trigger>
    <Styled.Content $transitionDuration={transitionDuration}>{children}</Styled.Content>
  </Styled.Root>
);

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Root = styled(Root)`
  display: grid;

  &[data-state='open'] {
    gap: 0.75rem;
  }
`;

Styled.Trigger = styled(Trigger)`
  ${popoverMixins.trigger}
  --trigger-textColor: inherit;
  --trigger-icon-width: 0.75em;
  --trigger-icon-color: inherit;
`;

Styled.TriggerIcon = styled.span`
  width: var(--trigger-icon-width);

  display: inline-flex;
  transition: rotate 0.3s var(--ease-out-expo);
  color: var(--trigger-icon-color);

  ${Styled.Trigger}[data-state='open'] & {
    rotate: -0.5turn;
  }
`;

Styled.Content = styled(Content)<{ $transitionDuration: number }>`
  display: grid;
  --transition-duration: 0.25s;

  ${({ $transitionDuration }) =>
    $transitionDuration &&
    css`
      --transition-duration: ${$transitionDuration}s;
    `}

  @media (prefers-reduced-motion: no-preference) {
    &[data-state='open'] {
      animation: ${keyframes`
        from {
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          scale: 0.8;
          filter: blur(2px);
        }

        to {
          overflow: hidden;
          max-height: var(--radix-collapsible-content-height);
        }
      `} var(--transition-duration) var(--ease-out-expo);
    }

    &[data-state='closed'] {
      animation: ${keyframes`
        from {
          overflow: hidden;
          max-height: var(--radix-collapsible-content-height);
        }

        to {
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          scale: 0.8;
          filter: blur(2px);
        }
      `} var(--transition-duration) var(--ease-out-expo);
    }
  }
`;
