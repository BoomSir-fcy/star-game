import React from 'react';
import { Text, Label, Box } from 'uikit';

const TestLabel: React.FC = () => {
  return (
    <Box>
      <Label pl='44px' pr='23px' width={592} justifyContent='space-between'>
        <Text>防御加成:所有建筑防御</Text>
        <Text color='legend'>+10</Text>
      </Label>
    </Box>
  );
};

export default TestLabel;
