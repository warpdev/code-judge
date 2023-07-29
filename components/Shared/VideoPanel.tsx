"use client";
import ReactPlayer, { ReactPlayerProps } from "react-player";

const VideoPanel = (props: ReactPlayerProps) => {
  return (
    <div className="container mx-auto aspect-video max-w-4xl">
      <ReactPlayer {...props} width="100%" height="100%" />
    </div>
  );
};

export default VideoPanel;
