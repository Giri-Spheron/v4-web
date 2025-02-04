import styled, { AnyStyledComponent, css } from 'styled-components';
import { Link } from 'react-router-dom';

import { Icon, IconName } from '@/components/Icon';

import { layoutMixins } from '@/styles/layoutMixins';

type PanelProps = {
  slotHeaderContent?: string;
  slotHeader?: React.ReactNode;
  slotRight?: React.ReactNode;
  children?: React.ReactNode;
  href?: string;
  onHeaderClick?: () => void;
  onClick?: () => void;
};

type PanelStyleProps = {
  className?: string;
  hasSeparator?: boolean;
};

export const Panel = ({
  slotHeaderContent,
  slotHeader,
  slotRight,
  children,
  href,
  onHeaderClick,
  onClick,
  hasSeparator,
  className,
}: PanelProps & PanelStyleProps) => (
  <Styled.Panel onClick={onClick}>
    <Styled.Left>
      {href ? (
        <Link to={href}>
          {slotHeader ? (
            slotHeader
          ) : (
            <Styled.Header role="button" onClick={onHeaderClick} hasSeparator={hasSeparator}>
              {slotHeaderContent}
              <Styled.Icon iconName={IconName.ChevronRight} />
            </Styled.Header>
          )}
        </Link>
      ) : slotHeader ? (
        slotHeader
      ) : (
        slotHeaderContent && (
          <Styled.Header role="button" onClick={onHeaderClick} hasSeparator={hasSeparator}>
            {slotHeaderContent}
          </Styled.Header>
        )
      )}
      <Styled.Content className={className}>{children}</Styled.Content>
    </Styled.Left>
    {slotRight}
  </Styled.Panel>
);

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Panel = styled.section`
  ${layoutMixins.row}

  background-color: var(--color-layer-3);
  border-radius: 0.875rem;
`;

Styled.Left = styled.div`
  ${layoutMixins.flexColumn}
  width: 100%;
`;

Styled.Header = styled.header<{ hasSeparator?: boolean }>`
  ${layoutMixins.spacedRow}
  padding: 1rem 1rem;

  ${({ hasSeparator }) =>
    hasSeparator &&
    css`
      padding-bottom: 0.625rem;
      box-shadow: 0 var(--border-width) var(--border-color);
    `}
`;

Styled.Icon = styled(Icon)`
  color: var(--color-text-0);
  font-size: 0.625rem;
`;

Styled.Content = styled.div`
  ${layoutMixins.scrollArea}
  ${layoutMixins.stickyArea0}
  --stickyArea0-background: transparent;
  padding: 1rem 1rem;
`;
