import React, { useCallback, useEffect, useRef, useState } from 'react';

interface SizeApi {
  width?: number;
  height?: number;
}
interface PositionApi {
  top: number | string;
  left: number | string;
}
interface VideoOptionsApi extends SizeApi, PositionApi {
  src: string;
  loop?: boolean;
  zIndex?: number;
}
interface ContextApi {
  show: boolean;
  videoOptions: VideoOptionsApi;
  setVideoOptions: (options: VideoOptionsApi) => void;
  videoRef: any;
}
const VideoContext = React.createContext({} as ContextApi);

const VideoProvider: React.FC = ({ children }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [show, setShow] = useState(false);
  const [videoOptions, setVideoOptionsState] = useState<VideoOptionsApi>({
    src: '',
    loop: true,
    zIndex: 1,
    width: 500,
    height: 500,
    top: 0,
    left: 0,
  });
  const setVideoOptions = useCallback(options => {
    setVideoOptionsState(p => {
      return { ...p, ...options };
    });
  }, []);

  useEffect(() => {
    if (videoOptions.src) setShow(true);
  }, [videoOptions.src]);

  return (
    <VideoContext.Provider
      value={{
        show,
        videoOptions,
        setVideoOptions,
        videoRef,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export { VideoContext, VideoProvider };
