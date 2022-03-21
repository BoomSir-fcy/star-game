import { ConnectWalletButton } from "components/ConnectWallet/ConnectWalletButton";
import React, { useEffect, useState } from "react";
import { Heading, Text, Flex, Box } from "uikit";

const Home: React.FC = () => {

  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log(count)
  }, [count])

  return (
    <Box>
      <ConnectWalletButton />
      <Flex flexDirection="column" alignItems="center">
        <Heading>Home{count}</Heading>
        <Text>这是首页</Text>
      </Flex>
    </Box>
  )
}

export default Home