import React, { useState } from 'react';
import { Flex, Text, Button, Image } from 'uikit';
import StarrySky from 'components/StarrySky';
import Modal from 'components/Modal';
import StarGameBox from './components/StarGameBox';

const Login = () => {
  const [visible, setVisible] = useState(true);

  return (
    <>
      <Flex
        height='100%'
        flexDirection='column'
        alignItems='center'
        justifyContent='space-around'
      >
        <StarGameBox />
        <Text>指挥官！请为自己创建一个身份</Text>
        <Button variant='login'>
          <Text color='blank' fontSize=''>
            ENTER
          </Text>
        </Button>
      </Flex>
      <Modal visible={visible} setVisible={setVisible}>
        <Image src='/images/commons/dsg-1.png' width={500} height={300} />
      </Modal>
    </>
  );
};

export default Login;
