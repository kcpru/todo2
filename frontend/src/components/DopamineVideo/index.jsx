import { useDopamine } from "@context/DopamineContext";
import demoVideo from "@assets/video.mp4";
import "./DopamineVideo.scss";

export function DopamineVideo() {
  const { isDopamineMode, videoEnabled, videoSize } = useDopamine();
  if (!isDopamineMode || !videoEnabled) return null;
  return (
    <video
      className={`fixed-video ${videoSize}`}
      src={demoVideo}
      autoPlay
      muted
      loop
      playsInline
    />
  );
}
