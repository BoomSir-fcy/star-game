import React, { useState, useRef, useEffect, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { space, SpaceProps } from 'styled-system';
import { Text, Flex, Box, Image } from 'uikit';

export const scales = {
  LD: 'ld',
  MD: 'md',
  SM: 'sm',
  XS: 'xs',
} as const;

export type Scale = typeof scales[keyof typeof scales];

export const scaleVariants = {
  [scales.LD]: {
    minWidth: '108px',
    minWidthBig: '108px',
  },
  [scales.MD]: {
    minWidth: '148px',
    minWidthBig: '168px',
  },
  [scales.SM]: {
    minWidth: '80px',
    minWidthBig: '128px',
  },
  [scales.XS]: {
    minWidth: '60px',
    minWidthBig: '100px',
  },
};

// 选择框打开方向
export const directions = {
  UP: 'up',
  DOWN: 'down',
} as const;

export type Direction = typeof directions[keyof typeof directions];

const DropDownHeader = styled.div`
  width: 100%;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  transition: border-radius 0.15s;
`;

const DropDownListContainer = styled.div<{ scale?: Scale }>`
  position: absolute;
  left: 0;
  width: 100%;
  min-width: ${({ scale }) => scale && scaleVariants[scale].minWidth};
  height: 0;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.input};
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  transition: transform 0.15s, opacity 0.15s;
  transform: scaleY(0);
  transform-origin: top;
  opacity: 0;
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: ${({ scale }) => scale && scaleVariants[scale].minWidthBig};
  }
`;

const DropDownContainer = styled.div<{
  isOpen: boolean;
  width?: string;
  height?: string;
  scale?: Scale;
  childrenHeight?: string;
  direction?: Direction;
}>`
  position: relative;
  width: ${({ width }) => width};
  min-width: ${({ scale }) => scale && scaleVariants[scale].minWidth};
  height: ${({ height }) => height};

  padding: 8px 16px;
  /* background: ${({ theme }) => theme.colors.input}; */
  border: 1px solid ${({ theme }) => theme.colors.borderPrimary};
  box-shadow: 0px 3px 2px 0px rgba(0, 0, 0, 0.35);
  /* border-radius: ${({ theme }) => theme.radii.card}; */
  background: ${({ theme }) => theme.colors.gradients.stripe};
  background-size: 10px 10px;
  user-select: none;
  cursor: pointer;
  z-index: 1;

  ::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: auto;
    background: ${({ theme }) => theme.colors.gradients.stripeBg};
    z-index: -1;
  }
  ${props =>
    props.isOpen &&
    css`
      ${DropDownHeader} {
        /* border-bottom: 1px solid ${({ theme }) => theme.colors.input};
        border-radius: 16px 16px 0 0; */
      }

      ${DropDownListContainer} {
        height: auto;
        transform: scaleY(1);
        opacity: 1;
        border: 1px solid ${({ theme }) => theme.colors.borderPrimary};
        background: ${({ theme }) => theme.colors.gradients.stripe};
        background-size: 10px 10px;
        z-index: 1;
        /* border-top-width: 0;
        border-radius: 0 0 16px 16px; */
        ::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          margin: auto;
          background: ${({ theme }) => theme.colors.gradients.stripeBg};
          z-index: -1;
        }
      }
    `}
  ${props =>
    props.isOpen &&
    props.childrenHeight &&
    props.direction === directions.DOWN &&
    css`
      ${DropDownListContainer} {
        max-height: ${props.childrenHeight};
        overflow-y: auto;
        transform: scaleY(1);
        opacity: 1;
        border: 1px solid ${({ theme }) => theme.colors.borderPrimary};
        border-top-width: 0;
        border-radius: 0 0 16px 16px;
      }
    `}
    ${props =>
    props.isOpen &&
    props.childrenHeight &&
    props.direction === directions.UP &&
    css`
      ${DropDownListContainer} {
        bottom: 55px;
        max-height: ${props.childrenHeight};
        overflow-y: auto;
        transform: scaleY(1);
        opacity: 1;
        border: 1px solid ${({ theme }) => theme.colors.borderPrimary};
        /* border-bottom-width: 0;
        border-radius: 16px 16px 0 0; */
      }
    `}
    ${space}
`;

const DropDownList = styled.ul`
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  list-style: none;
  &:hover {
    /* background: ${({ theme }) => theme.colors.gradients.card}; */
    background: #34a6a8;
  }
`;

export interface SelectProps extends SpaceProps {
  options: OptionProps[];
  defaultId?: string | number;
  width?: string;
  disabled?: boolean;
  onChange?: (option: OptionProps) => void;
  scale?: Scale;
  childrenHeight?: string;
  idKey?: string;
  direction?: Direction; // 方向
  height?: string;
}

export interface OptionProps {
  label: string;
  value: any;
  id?: string | number;
  icon?: ReactNode;
  [key: string]: any;
}

export const Select: React.FunctionComponent<SelectProps> = ({
  options,
  defaultId,
  disabled,
  onChange,
  idKey,
  scale,
  width,
  children,
  height = '50px',
  direction = 'down',
  childrenHeight = '150px',
  ...props
}) => {
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);

  const toggling = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    setIsOpen(!isOpen);
    event.stopPropagation();
  };

  useEffect(() => {
    if (defaultId) {
      options.forEach((item, index) => {
        if (
          (item.value?.[idKey as string] || item.value || item.id) ===
            defaultId &&
          index !== selectedOptionIndex
        ) {
          setSelectedOptionIndex(index);
        }
      });
    }
  }, [defaultId, idKey, options, selectedOptionIndex]);

  const onOptionClicked = (selectedIndex: number) => () => {
    setSelectedOptionIndex(selectedIndex);
    setIsOpen(false);

    if (onChange) {
      onChange(options[selectedIndex]);
    }
  };

  useEffect(() => {
    // setContainerSize({
    //   width: dropdownRef.current ? dropdownRef.current.offsetWidth : 0, // Consider border
    //   height: dropdownRef.current ? dropdownRef.current.offsetHeight : 0,
    // });
    const handleClickOutside = () => {
      setIsOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <DropDownContainer
      childrenHeight={childrenHeight}
      scale={scale}
      isOpen={isOpen}
      width={width}
      height={height}
      direction={direction}
      ref={containerRef}
      {...props}
    >
      <Flex height='100%' justifyContent='space-between' alignItems='center'>
        <DropDownHeader className='select-header' onClick={toggling}>
          {options[selectedOptionIndex]?.icon &&
            options[selectedOptionIndex]?.icon}
          <Text ellipsis small>
            {options[selectedOptionIndex]?.label}
          </Text>
          {children}
        </DropDownHeader>
        <ArrowDropDownIcon direction={direction} />
      </Flex>
      <DropDownListContainer scale={scale}>
        <DropDownList ref={dropdownRef}>
          {options.map((option, index) =>
            index !== selectedOptionIndex ? (
              <ListItem onClick={onOptionClicked(index)} key={option.label}>
                {option?.icon && option.icon}
                <Text ellipsis small>
                  {option.label}
                </Text>
              </ListItem>
            ) : null,
          )}
        </DropDownList>
      </DropDownListContainer>
    </DropDownContainer>
  );
};

const ArrowDropDownIcon: React.FC<{ direction: Direction }> = ({
  direction,
}) => {
  return (
    <Box
      width='22px'
      height='27px'
      style={{
        transform: `${
          direction === 'down' ? 'rotate(90deg)' : 'rotate(-90deg)'
        }`,
      }}
    >
      <Image
        width={22}
        height={27}
        src='/images/commons/icon/icon_arrow_right.png'
        alt=''
      />
    </Box>
  );
};
Select.defaultProps = {
  scale: scales.MD,
};
