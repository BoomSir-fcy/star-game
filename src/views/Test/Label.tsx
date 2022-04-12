import React from 'react';
import { Text, Label, Box } from 'uikit';
import { useVideo } from 'contexts/VideoContext';

const TestLabel: React.FC = () => {
  const { setVideoOptions, videoRef } = useVideo();
  React.useEffect(() => {
    setVideoOptions({
      src: '/video/pk-2.mp4',
      top: '38%',
      left: '37%',
      // loop: false,
    });
    if (videoRef.current) {
      console.log(videoRef.current);
    }
  }, [videoRef]);
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
