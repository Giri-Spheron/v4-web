import styled, { type AnyStyledComponent, css } from 'styled-components';

import { AbacusApiStatus } from '@/constants/abacus';
import { ButtonSize } from '@/constants/buttons';
import { STRING_KEYS } from '@/constants/localization';
import { ENVIRONMENT_CONFIG_MAP } from '@/constants/networks';

import { useApiState, useSelectedNetwork, useStringGetter } from '@/hooks';
import { ChatIcon, LinkOutIcon } from '@/icons';

import { layoutMixins } from '@/styles/layoutMixins';

import { Button } from '@/components/Button';
import { Details } from '@/components/Details';
import { Output, OutputType } from '@/components/Output';
import { WithTooltip } from '@/components/WithTooltip';

enum FooterItems {
  ChainHeight,
  IndexerHeight,
}

enum ExchangeStatus {
  Operational = 'Operational',
  Degraded = 'Degraded',
}

export const FooterDesktop = () => {
  const stringGetter = useStringGetter();
  const { height, indexerHeight, status, statusErrorMessage } = useApiState();
  const { selectedNetwork } = useSelectedNetwork();
  const { statusPage } = ENVIRONMENT_CONFIG_MAP[selectedNetwork].links;

  const { exchangeStatus, label } =
    !status || status === AbacusApiStatus.NORMAL
      ? {
          exchangeStatus: ExchangeStatus.Operational,
          label: stringGetter({ key: STRING_KEYS.OPERATIONAL }),
        }
      : {
          exchangeStatus: ExchangeStatus.Degraded,
          label: stringGetter({ key: STRING_KEYS.DEGRADED }),
        };

  return (
    <Styled.Footer>
      <Styled.Row>
        <WithTooltip
          slotTooltip={
            statusErrorMessage && (
              <dl>
                <dd>{statusErrorMessage}</dd>
              </dl>
            )
          }
        >
          <Styled.FooterButton
            slotLeft={<Styled.StatusDot exchangeStatus={exchangeStatus} />}
            slotRight={statusPage && <LinkOutIcon />}
            size={ButtonSize.XSmall}
            state={{ isDisabled: !statusPage }}
          >
            {label}
          </Styled.FooterButton>
        </WithTooltip>

        {globalThis?.Intercom && (
          <Styled.FooterButton
            slotLeft={<ChatIcon />}
            size={ButtonSize.XSmall}
            onClick={() => globalThis.Intercom('show')}
          >
            {stringGetter({ key: STRING_KEYS.HELP_AND_SUPPORT })}
          </Styled.FooterButton>
        )}
      </Styled.Row>

      {import.meta.env.MODE !== 'production' && (
        <Styled.Details
          withSeparators
          items={[
            {
              key: FooterItems.ChainHeight,
              label: 'Block Height',
              value: <Output useGrouping type={OutputType.Number} value={height} />,
            },
            height !== indexerHeight && {
              key: FooterItems.IndexerHeight,
              label: 'Indexer Block Height',
              value: (
                <Styled.WarningOutput useGrouping type={OutputType.Number} value={indexerHeight} />
              ),
            },
          ].filter(Boolean)}
          layout="row"
        />
      )}
    </Styled.Footer>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Footer = styled.footer`
  ${layoutMixins.stickyFooter}
  ${layoutMixins.spacedRow}
  grid-area: Footer;
`;

Styled.Row = styled.div`
  ${layoutMixins.row}
  ${layoutMixins.spacedRow}
  width: var(--sidebar-width);

  padding: 0 0.5rem;
  border-right: 1px solid var(--color-border);
`;

Styled.StatusDot = styled.div<{ exchangeStatus: ExchangeStatus }>`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  margin-right: 0.25rem;

  background-color: ${({ exchangeStatus }) =>
    ({
      [ExchangeStatus.Degraded]: css`var(--color-warning)`,
      [ExchangeStatus.Operational]: css`var(--color-positive)`,
    }[exchangeStatus])};
`;

Styled.FooterButton = styled(Button)`
  --button-height: 1.5rem;
  --button-radius: 0.25rem;
  --button-backgroundColor: var(--color-layer-2);
  --button-border: none;
  --button-textColor: var(--color-text-0);

  &:hover:not(:disabled) {
    --button-backgroundColor: var(--color-layer-3);
    --button-textColor: var(--color-text-1);
  }

  &:disabled {
    cursor: default;
  }
`;

Styled.WarningOutput = styled(Output)`
  color: var(--color-warning);
`;

Styled.Details = styled(Details)`
  ${layoutMixins.scrollArea}
  font: var(--font-tiny-book);
`;
