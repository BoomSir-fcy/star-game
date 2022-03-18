import React from "react";
import { Heading, Text, Flex, Box } from "uikit";

const Home: React.FC = () => {
  return (
    <Box>
      <Flex flexDirection="column" alignItems="center">
        <Heading>Home</Heading>
        <Text>这是首页</Text>
      </Flex>
    </Box>
  )
}

export default Home