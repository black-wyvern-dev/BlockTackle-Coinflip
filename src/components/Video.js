import { useEffect, useRef } from 'react';

const Video = ({ type, source, replay }) => {
  const videoRef = useRef();

  useEffect(() => {
    videoRef.current?.load();
  }, [source]);

  return (
    <video ref={videoRef} width="100%" autoPlay loop={replay} muted>
      <source src={source} type={type} />
      Sorry, your browser doesn't support videos.
    </video>
  );
};

export default Video;
