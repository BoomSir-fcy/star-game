import React from "react";
import { Heading, Text, Flex, Box } from "uikit";

const Test: React.FC = () => {
  return (
    <Box>
      <Flex flexDirection="column" alignItems="center">
        <Heading>Test</Heading>
        <Text>开发测试页面</Text>
      </Flex>
    </Box>
  )
}

export default Test