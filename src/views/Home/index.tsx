import { ConnectWalletButton } from "components/ConnectWallet/ConnectWalletButton";
import React, { useEffect, useState } from "react";
import { Heading, Text, Flex, Box } from "uikit";
import Dashboard from 'components/Dashboard'

const Home: React.FC = () => {

  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log(count)
  }, [count])

  return (
    <Box>
      <Dashboard />
    </Box>
  )
}

export default Home