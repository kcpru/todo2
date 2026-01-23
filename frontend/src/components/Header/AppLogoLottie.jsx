import Lottie from "lottie-react";
import checkLottie from "@assets/lottie/system-solid-31-check-in-reveal.json";

export function AppLogoLottie() {
  return (
    <span className="lottie-color">
      <Lottie
        animationData={checkLottie}
        loop={false}
        autoplay={true}
        style={{ width: 38, height: 38 }}
        rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
      />
    </span>
  );
}
