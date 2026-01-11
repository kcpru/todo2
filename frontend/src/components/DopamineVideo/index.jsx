import { useDopamine } from "../../DopamineContext";
import demoVideo from "../../assets/video.mp4";
import "./DopamineVideo.scss";

export function DopamineVideo() {
  const { isDopamineMode } = useDopamine();

  if (!isDopamineMode) return null;

  return (
    <video
      className="fixed-video"
      src={demoVideo}
      autoPlay
      muted
      loop
      playsInline
    />
  );
}
