import React, { useCallback, useEffect, useRef, useState } from 'react';

interface SizeApi {
  width?: number;
  height?: number;
}
interface PositionApi {
  top?: number | string;
  left?: number | string;
  bottom?: number | string;
  right?: number | string;
  margin?: string;
}
interface VideoOptionsApi extends SizeApi, PositionApi {
  src: string;
  loop?: boolean;
  zIndex?: number;
  center?: boolean;
}
interface ContextApi {
  show: boolean;
  videoOptions: VideoOptionsApi;
  setVideoOptions: (options: VideoOptionsApi) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
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
    bottom: 0,
    right: 0,
    margin: '',
    center: true,
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
