import React from 'react';
import { Text, Button, Box } from 'uikit';

const TestButton: React.FC = () => {
  return (
    <Box>
      <Button padding='50px'>这是一个按钮</Button>
      <Button variant='vs'>这是一个按钮</Button>
      <Button variant='vsRefresh'>这是一个按钮</Button>
    </Box>
  );
};

export default TestButton;
