import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from 'uikit';
import StyledNav from './StyledNav';
import { NavProps, NavConfig } from './types';

const NavList = styled.div`
  height: 95%;
  overflow-y: auto;
`;
const ButtonStyled = styled(Button)`
  width: 203px;
  height: 70px;
  font-size: 22px;
`;

const Line = styled.div`
  width: 203px;
  height: 2px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0),
    #bf3737,
    rgba(255, 255, 255, 0)
  );
`;

const ActiveButton = styled(ButtonStyled)`
  background: url('/images/commons/nav/select.png');
`;

let flag = 0;
const pushEmptyNav = (nav: NavConfig[]): NavConfig[] => {
  if (nav.length >= 7) return nav;
  flag += 1;
  return pushEmptyNav(
    nav.concat([
      {
        id: `empty-${flag}`,
        label: '',
      },
    ]),
  );
};
const Nav: React.FC<NavProps> = ({
  children,
  nav = [],
  activeId,
  onChangeNav,
  ...props
}) => {
  const navList = useMemo(() => {
    return pushEmptyNav(nav);
  }, [nav]);

  // TODO: activeId 等功能优化

  const [active, setActive] = useState(nav[0]?.id);

  useEffect(() => {
    if (activeId) setActive(activeId);
  }, [activeId]);

  const navigate = useNavigate();

  return (
    <StyledNav {...props}>
      <NavList>
        {navList.map((item, index) => (
          <div key={item.id}>
            {item.id === active && (
              <ActiveButton variant='custom'>{item.label}</ActiveButton>
            )}
            {item.id !== active && (
              <ButtonStyled
                disabled={!item.label}
                onClick={() => {
                  if (item.label !== '') {
                    setActive(item.id);
                    if (onChangeNav) {
                      onChangeNav({ ...item });
                    }
                    if (item.path) {
                      navigate(item.path, { replace: true });
                    }
                  }
                }}
                variant='custom'
              >
                {item.label}
              </ButtonStyled>
            )}
            {index !== navList.length && <Line />}
          </div>
        ))}
      </NavList>
    </StyledNav>
  );
};
export default Nav;
