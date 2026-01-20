import { useState, useEffect, useRef } from "react";
import ToggleRow from "@components/ToggleRow";
import HeaderRow from "@components/HeaderRow";
import { useDopamine } from "@context/DopamineContext";
import { GradientButton } from "@components/GradientButton";
import { CustomSlider } from "@components/CustomSlider";
import { FilterSelect } from "@components/FilterSelect";
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
        <HeaderRow
          icon={<MdCelebration className="settings-section-icon" />}
          title="Dopamine Effects"
          subtitle="Fun effects and video for extra motivation."
        />
      </div>
      <div className="dopamine-row">
        <div className="dopamine-controls">
          <ToggleRow
            label="Dopamine mode"
            value={isDopamineMode}
            onChange={toggleDopamineMode}
            className="dopamine-toggle-row"
          />

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
                <ToggleRow
                  label="Dopamine video"
                  value={videoEnabled}
                  onChange={toggleVideoEnabled}
                  className="dopamine-video-toggle-row"
                />
              </div>
              <div className="dopamine-video-size-row">
                <span className="dopamine-label">Size</span>
                <FilterSelect
                  options={[
                    { value: "small", label: "Small" },
                    { value: "medium", label: "Medium" },
                    { value: "large", label: "Large" },
                  ]}
                  value={videoSize}
                  onChange={updateVideoSize}
                  ariaLabel="Dopamine video size"
                  size="sm"
                  onMouseEnter={() => setVideoPreviewSize(videoSize)}
                  onMouseLeave={() => setVideoPreviewSize(null)}
                />
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
