import React from 'react';
import { Box, Flex, BackButton, RefreshButton, Text } from 'uikit';
import { StarGrid } from 'components';

const Upgrade = () => {
  const [state, setState] = React.useState({
    box: [
      {
        index: 1,
        row: 2,
        bgColor: 'red',
      },
      {
        index: 2,
        row: 1,
        bgColor: 'green',
      },
      {
        index: 3,
        row: 1,
        bgColor: 'blue',
      },
      {
        index: 4,
        row: 1,
        bgColor: 'yellow',
      },
      {
        index: 5,
        row: 1,
        bgColor: 'orange',
      },
      {
        index: 6,
        row: 1,
        bgColor: 'grey',
      },
    ],
  });

  console.log(state.box);

  return (
    <Box>
      <Text>星球升级</Text>
      <Box
        style={{
          width: '500px',
          height: '500px',
          margin: '0 auto',
        }}
      >
        <StarGrid
          data={state.box}
          onLayoutChange={() => {}}
          items={9}
          cols={3}
        />
      </Box>
    </Box>
  );
};

export default Upgrade;
