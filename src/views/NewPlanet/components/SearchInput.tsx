import React from 'react';
import styled from 'styled-components';
import { Flex, Text, Input, Button, CircleLoader, Image } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { useStore } from 'state';

const SearchContainer = styled(Flex)<{ focus?: boolean }>`
  width: 560px;
  height: 50px;
  font-size: 24px;
  transition: all 0.3s;
  background: #4b4b4b80;
  border-radius: ${({ theme }) => theme.radii.card};
  border: 1px solid ${({ focus, theme }) => (focus ? '#F9FEFF' : 'transparent')};
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
  &:focus {
    color: #fff;
  }
`;
const ButtonStyled = styled(Button)<{ focus?: boolean }>`
  width: 50px;
  height: auto;
  font-weight: 400;
  opacity: ${({ focus }) => (focus ? 1 : 0)};
`;
const ButtonStyledLine = styled(ButtonStyled)`
  &:focus {
    /* outline: 3px solid ${({ theme }) => theme.colors.textPrimary}; */
    outline: 3px solid #7393ff;
  }
`;

const SearchInput: React.FC<{
  onEndCallback: (value: string) => void;
}> = ({ onEndCallback }) => {
  const { t } = useTranslation();

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [toFocus, setToFocus] = React.useState(false);
  const [state, setState] = React.useState({
    focus: false,
    value: '',
  });
  const { focus, value } = state;
  const loading = useStore(p => p.planet.mePlanetLoading);

  return (
    <form
      onFocus={() =>
        setState({
          ...state,
          focus: true,
        })
      }
      onBlur={e => {
        if (toFocus) {
          setToFocus(false);
          e.target.focus();
          return;
        }
        setState({
          ...state,
          focus: false,
        });
      }}
      onSubmit={event => {
        event.preventDefault();
        if (!value) return;
        if (inputRef.current) {
          inputRef.current.blur();
        }
        onEndCallback(value.trim());
      }}
    >
      <label htmlFor='search'>
        <SearchContainer focus={focus}>
          <Flex width='100%' height='100%' alignItems='center'>
            <ButtonStyled focus padding='0' variant='text'>
              {loading ? (
                <CircleLoader color='white' />
              ) : (
                <Image
                  width={50}
                  height={50}
                  src='/images/commons/icon/search.png'
                  color='white'
                />
              )}
            </ButtonStyled>
            <InputStyled
              value={value}
              ref={inputRef}
              autoComplete='off'
              onBlur={e => {
                if (!e.target.value) {
                  onEndCallback(value.trim());
                }
              }}
              onChange={e => {
                e.preventDefault();
                e.stopPropagation();
                setState({
                  ...state,
                  value: e.target.value,
                });
              }}
              placeholder={t('Enter the planet token to search')}
            />

            <ButtonStyledLine
              // tabIndex={-1}
              onMouseDown={() => setToFocus(true)}
              onClick={() => {
                setState({
                  ...state,
                  value: '',
                });
              }}
              focus={focus}
              padding='0'
              type='button'
              variant='text'
            >
              <Image
                width={30}
                height={30}
                src='/images/commons/icon/guanbi.png'
                color='white_black'
              />
            </ButtonStyledLine>
          </Flex>
        </SearchContainer>
      </label>
    </form>
  );
};

export default SearchInput;
