import React from 'react';
import styled from 'styled-components';
import { Flex, Text, Input } from 'uikit';
import { useTranslation } from 'contexts/Localization';

const SearchContainer = styled(Flex)<{ focus?: boolean }>`
  width: 560px;
  height: 50px;
  font-size: 24px;
  transition: all 0.3s;
  background: #4b4b4b;
  border-radius: ${({ theme }) => theme.radii.card};
  border: 1px solid ${({ focus, theme }) => (focus ? '#F9FEFF' : 'transparent')};
  opacity: 0.5;
  &:hover {
    border: 1px solid ${({ theme }) => '#F9FEFF'};
  }
`;

const InputStyled = styled(Input)`
  width: 100%;
  height: 100%;
  padding-left: 30px;
  font-size: 24px;
  background-color: transparent;
`;

const SearchInput: React.FC<{
  onEndCallback: (value: string) => void;
}> = ({ onEndCallback }) => {
  const { t } = useTranslation();

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [state, setState] = React.useState({
    focus: false,
    value: '',
  });
  const { focus, value } = state;

  return (
    <form
      onFocus={() =>
        setState({
          ...state,
          focus: true,
        })
      }
      onBlur={e =>
        setState({
          ...state,
          focus: false,
        })
      }
      onSubmit={event => {
        event.preventDefault();
        if (inputRef.current) {
          inputRef.current.blur();
        }
        onEndCallback(value.trim());
      }}
    >
      <Flex>
        <SearchContainer focus={focus}>
          <InputStyled
            ref={inputRef}
            autoComplete='off'
            onBlur={e => {
              if (!e.target.value) {
                onEndCallback(value.trim());
              }
            }}
            onChange={e =>
              setState({
                ...state,
                value: e.target.value,
              })
            }
            placeholder={t('Enter the planet token to search')}
          />
        </SearchContainer>
      </Flex>
    </form>
  );
};

export default SearchInput;
