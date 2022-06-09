import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { Flex, Box, Image, Text } from 'uikit';
import { fetchPlanetBuildingsAsync } from 'state/buildling/fetchers';
import { useTranslation } from 'contexts/Localization';
import { ThingRepair } from '..';

const StyledImage = styled(Image)`
  flex-shrink: 0;
  margin-right: 9px;
`;

export const BuildingValue: React.FC<{
  itemData: Api.Building.Building;
  planet_id?: number;
  title: string;
  value: string;
  addedValue?: number;
  icon: string;
  isRepair?: boolean;
}> = React.memo(
  ({ itemData, planet_id, title, value, addedValue, icon, isRepair }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    // const getSelfBuilding = () => {
    //   dispatch(fetchPlanetBuildingsAsync(planet_id));
    // };

    return (
      <>
        <Box width={50} height={50} mr='5px'>
          <StyledImage width={50} height={50} src={icon} />
        </Box>
        <Flex flexDirection='column' style={{ width: ' calc(100% - 55px)' }}>
          <Flex alignItems='center'>
            <Text color='textSubtle' small>
              {title}
            </Text>
            {isRepair &&
              itemData?.propterty?.now_durability !==
                itemData?.propterty?.max_durability && (
                <ThingRepair
                  itemData={itemData}
                  planet_id={planet_id}
                  building_id={itemData?._id}
                  // onCallback={getSelfBuilding}
                />
              )}
          </Flex>
          <Flex alignItems='center'>
            <Text ellipsis fontSize='18px' title={value}>
              {value}
            </Text>
            <Text
              ml='5px'
              bold
              ellipsis
              color='progressGreenBar'
              fontSize='16px'
              title={addedValue?.toString()}
            >
              {addedValue
                ? addedValue > 0
                  ? `+${addedValue}`
                  : `-${addedValue}`
                : ''}
            </Text>
          </Flex>
        </Flex>
      </>
    );
  },
);
