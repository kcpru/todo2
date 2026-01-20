import { useState, useEffect, useRef } from "react";
import { useDopamine } from "@context/DopamineContext";
import { GradientButton } from "@components/GradientButton";
import { CustomSlider } from "@components/CustomSlider";
import { MdCelebration } from "react-icons/md";
import "./Settings.scss";

export default function DopamineSection() {
  const {
    isDopamineMode,
    toggleDopamineMode,
    confettiCount,
    animationSpeed,
    updateConfettiCount,
    updateAnimationSpeed,
    videoEnabled,
    toggleVideoEnabled,
    videoSize,
    updateVideoSize,
  } = useDopamine();
  const [videoPreviewSize, setVideoPreviewSize] = useState(null);
  const confettiCanvasRef = useRef(null);
  const animationBoxRef = useRef(null);

  useEffect(() => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf = null;
    const w = (canvas.width = 220);
    const h = (canvas.height = 120);

    const maxPieces = Math.min(
      120,
      Math.max(0, Math.round((confettiCount / 300) * 120))
    );

    const colors = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#AA6BFF"];

    const pieces = Array.from({ length: maxPieces }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * -h,
      r: 3 + Math.random() * 5,
      dx: (Math.random() - 0.5) * 1.2,
      dy: 0.6 + Math.random() * 2.4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI * 2,
      dr: (Math.random() - 0.5) * 0.2,
    }));

    const speedScale = animationSpeed === "slow" ? 0.4 : 1;

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const p of pieces) {
        p.x += p.dx * speedScale;
        p.y += p.dy * speedScale;
        p.rot += p.dr * speedScale;

        if (p.y > h + 10) {
          p.y = -10 - Math.random() * h * 0.5;
          p.x = Math.random() * w;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6);
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [confettiCount, animationSpeed]);

  useEffect(() => {
    const el = animationBoxRef.current;
    if (!el) return;
    const speed = Math.max(0.05, Number(animationSpeed) || 1);
    el.style.setProperty("animation-duration", `${(1 / speed).toFixed(2)}s`);
  }, [animationSpeed]);

  return (
    <section className="settings-section dopamine-section settings-card">
      <div className="settings-header-row">
        <MdCelebration className="settings-section-icon" />
        <div>
          <h3>Dopamine Effects</h3>
          <div className="settings-section-desc">
            Fun effects and video for extra motivation.
          </div>
        </div>
      </div>
      <div className="dopamine-row">
        <div className="dopamine-controls">
          <div className="dopamine-toggle-row">
            <span className="dopamine-label">Enable Dopamine Mode</span>
            <GradientButton
              variant={isDopamineMode ? "primary" : "secondary"}
              onClick={toggleDopamineMode}
            >
              {isDopamineMode ? "On" : "Off"}
            </GradientButton>
          </div>

          <div className="dopamine-field dopamine-with-preview">
            <div className="dopamine-field-main">
              <CustomSlider
                min={0}
                max={100}
                step={10}
                value={confettiCount}
                onChange={(e) => updateConfettiCount(e.target.value)}
                label="Confetti amount"
              />
              <div className="confetti-slider-info">
                <span className="confetti-slider-value">{confettiCount}</span>
                <span className="confetti-slider-desc">
                  - Number of confetti particles per burst
                </span>
              </div>
            </div>
            <div className="dopamine-preview">
              <canvas ref={confettiCanvasRef} className="preview-canvas" />
            </div>
          </div>

          <div className="dopamine-field dopamine-with-preview">
            <div className="dopamine-field-main">
              <span className="dopamine-label">Animation speed</span>
              <div className="speed-toggle-row">
                <GradientButton
                  variant={animationSpeed === "fast" ? "primary" : "secondary"}
                  onClick={() => updateAnimationSpeed("fast")}
                  size="sm"
                >
                  Fast
                </GradientButton>
                <GradientButton
                  variant={animationSpeed === "slow" ? "primary" : "secondary"}
                  onClick={() => updateAnimationSpeed("slow")}
                  size="sm"
                >
                  Slow
                </GradientButton>
              </div>
            </div>
            <div className="dopamine-preview">
              <div
                ref={animationBoxRef}
                className={`speed-preview-bar ${animationSpeed}`}
              ></div>
            </div>
          </div>

          <div className="dopamine-field dopamine-video-row">
            <div className="dopamine-video-group">
              <div className="dopamine-video-toggle-row">
                <span className="dopamine-label">Dopamine video</span>
                <GradientButton
                  variant={videoEnabled ? "primary" : "secondary"}
                  onClick={toggleVideoEnabled}
                  size="sm"
                >
                  {videoEnabled ? "On" : "Off"}
                </GradientButton>
              </div>
              <div className="dopamine-video-size-row">
                <span className="dopamine-label">Size</span>
                <GradientButton
                  variant={videoSize === "small" ? "primary" : "secondary"}
                  onClick={() => updateVideoSize("small")}
                  size="sm"
                  onMouseEnter={() => setVideoPreviewSize("small")}
                  onMouseLeave={() => setVideoPreviewSize(null)}
                >
                  Small
                </GradientButton>
                <GradientButton
                  variant={videoSize === "medium" ? "primary" : "secondary"}
                  onClick={() => updateVideoSize("medium")}
                  size="sm"
                  style={{ marginLeft: "0.5rem" }}
                  onMouseEnter={() => setVideoPreviewSize("medium")}
                  onMouseLeave={() => setVideoPreviewSize(null)}
                >
                  Medium
                </GradientButton>
                <GradientButton
                  variant={videoSize === "large" ? "primary" : "secondary"}
                  onClick={() => updateVideoSize("large")}
                  size="sm"
                  style={{ marginLeft: "0.5rem" }}
                  onMouseEnter={() => setVideoPreviewSize("large")}
                  onMouseLeave={() => setVideoPreviewSize(null)}
                >
                  Large
                </GradientButton>
                {videoPreviewSize && (
                  <div
                    className={`video-size-preview video-size-preview--${videoPreviewSize}`}
                    data-label={
                      videoPreviewSize === "small"
                        ? "Small"
                        : videoPreviewSize === "medium"
                          ? "Medium"
                          : "Large"
                    }
                  ></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
