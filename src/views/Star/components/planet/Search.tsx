import React from 'react';
import styled from 'styled-components';
import { Flex, Text, Input } from 'uikit';
import { useTranslation } from 'contexts/Localization';

const SearchContainer = styled(Flex)<{ focus?: boolean }>`
  width: 673px;
  height: 55px;
  background: #313131;
  font-size: 20px;
  transition: all 0.3s;
  border-radius: ${({ theme }) => theme.radii.card};
  border: 1px solid ${({ focus, theme }) => (focus ? '#F9FEFF' : 'transparent')};
  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.borderPrimary};
  }
  align-items: center;
`;

const SearchInput = styled(Input)`
  width: 100%;
  height: 100%;
  padding-left: 30px;
  font-size: 20px;
  background-color: transparent;
`;
export const PlanetSearch: React.FC<{
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
      <Flex width='100%' justifyContent='center' alignItems='center'>
        <SearchContainer focus={focus}>
          <Text fontSize='24px' width='94px' ml='10px'>
            Token :
          </Text>
          <SearchInput
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
