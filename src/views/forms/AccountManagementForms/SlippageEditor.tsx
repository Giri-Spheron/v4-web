import { type Dispatch, type SetStateAction, useEffect, useState, useRef } from 'react';
import styled, { type AnyStyledComponent } from 'styled-components';
import type { NumberFormatValues } from 'react-number-format';

import { ButtonShape, ButtonSize } from '@/constants/buttons';
import { STRING_KEYS } from '@/constants/localization';
import { useStringGetter } from '@/hooks';
import { layoutMixins } from '@/styles/layoutMixins';

import { WithConfirmationPopover } from '@/components/WithConfirmationPopover';
import { Icon, IconName } from '@/components/Icon';
import { Input, InputType } from '@/components/Input';
import { Output, OutputType } from '@/components/Output';
import { ToggleGroup } from '@/components/ToggleGroup';
import { FormInput } from '@/components/FormInput';

enum EditorState {
  Viewing = 'Viewing',
  Selecting = 'Selecting',
  Editing = 'Editing',
}

type ElementProps = {
  slippage: number;
  setIsEditing?: Dispatch<SetStateAction<boolean>>;
  setSlippage: (slippage: number) => void;
};

export type SlippageEditorProps = ElementProps;

export const SlippageEditor = ({ slippage, setIsEditing, setSlippage }: SlippageEditorProps) => {
  const percentSlippage = slippage * 100;
  const [slippageInputValue, setSlippageInputValue] = useState(percentSlippage.toString());
  const [editorState, setEditorState] = useState(EditorState.Viewing);

  const stringGetter = useStringGetter();

  const toggleGroupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsEditing?.(editorState !== EditorState.Viewing);

    if (editorState === EditorState.Selecting) {
      // use setTimeout with a 0ms delay to focus asynchronously.
      setTimeout(() => toggleGroupRef?.current?.focus(), 0);
    } else if (editorState === EditorState.Editing) {
      inputRef?.current?.focus();
    } else if (editorState === EditorState.Viewing) {
    }
  }, [editorState]);

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setEditorState(EditorState.Viewing);
    }
  };

  const onCancel = () => {
    setEditorState(EditorState.Viewing);
    setSlippageInputValue(percentSlippage.toString());
  };

  const onChangeSlippage = ({ value }: NumberFormatValues) => {
    setSlippageInputValue(value);
  };

  const onConfirmSlippage = () => {
    setEditorState(EditorState.Viewing);
    setSlippage(Number(slippageInputValue) / 100);
  };

  const onSelectSlippage = (newSlippage: string) => {
    if (newSlippage === 'custom') {
      setEditorState(EditorState.Editing);
    } else {
      setSlippage(Number(newSlippage));

      setEditorState(EditorState.Viewing);
    }
  };

  return (
    <Styled.WithConfirmationPopover
      open={editorState !== EditorState.Viewing}
      onOpenChange={onOpenChange}
      align="end"
      sideOffset={-22}
      asChild
      onCancel={onCancel}
      onConfirm={editorState === EditorState.Editing && onConfirmSlippage}
      slotTrigger={
        <Styled.SlippageOutput onClick={() => setEditorState(EditorState.Selecting)}>
          <Output type={OutputType.Percent} value={slippage} />
          <Icon iconName={IconName.Pencil} />
        </Styled.SlippageOutput>
      }
    >
      {
        {
          [EditorState.Viewing]: null,
          [EditorState.Selecting]: (
            <Styled.SlippageInput>
              <ToggleGroup
                ref={toggleGroupRef}
                items={[
                  { label: '0.1%', value: '0.001' },
                  { label: '0.25%', value: '0.0025' },
                  { label: stringGetter({ key: STRING_KEYS.CUSTOM }), value: 'custom' },
                ]}
                value={slippage.toString()}
                onValueChange={onSelectSlippage}
                shape={ButtonShape.Rectangle}
                size={ButtonSize.XSmall}
              />
            </Styled.SlippageInput>
          ),
          [EditorState.Editing]: (
            <Styled.FormInput
              type={InputType.Percent}
              value={slippageInputValue}
              tabIndex={0}
              getInputRef={inputRef}
              onChange={onChangeSlippage}
              max={100}
            />
          ),
        }[editorState]
      }
    </Styled.WithConfirmationPopover>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.SlippageOutput = styled.button`
  ${layoutMixins.row}
  text-decoration: underline;
  gap: 0.5ch;
`;

Styled.WithConfirmationPopover = styled(WithConfirmationPopover)`
  font-size: 0.625rem;
  width: 10rem;
`;

Styled.SlippageInput = styled.div`
  ${layoutMixins.inlineRow}

  justify-content: center;
  background-color: var(--color-layer-2);
  border-radius: 0.5em;
`;

Styled.FormInput = styled(FormInput)`
  --form-input-height: 1.5rem;

  input {
    text-align: end;
  }
`;
