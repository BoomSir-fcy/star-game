import React from "react";
import { Flex } from "uikit";
import Avatar from "./Avatar";
import Info from "./Info";

const Dashboard = () => {
  return (
    <Flex>
      <Flex flex={1}>
        <Avatar />
      </Flex>
      <Flex flex={8}>
        <Info />
      </Flex>
    </Flex>
  )
}

export default Dashboard;
