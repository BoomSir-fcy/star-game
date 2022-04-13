import { useContext } from 'react';
import { VideoContext } from './Provider';

const useVideo = () => {
  const videoContext = useContext(VideoContext);
  return videoContext;
};

export default useVideo;
