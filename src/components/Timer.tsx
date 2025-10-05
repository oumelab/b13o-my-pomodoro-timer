import { Pause, Play, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { ControlButton } from "./ControlButton";
import { ModeTypeButton } from "./ModeTypeButton";

const Timer = () => {
  // 作業/休憩モード
  const [mode, setMode] = useState<"work" | "break">("work");
  // タイマーが動いているかどうか
  const [isRunning, setIsRunning] = useState(false);


  // ダミーコード
  const displayMinutes = "25";
  const displaySeconds = "00";
  const handleChangeMode = () => {};
  const handleStart = () => {};
  const handleStop = () => {};
  const handleReset = () => {};

  return (
    <div
      className={`flex justify-center rounded-xl p-4 bg-gradient-to-br w-[740px] mx-auto ${
        mode === "work"
          ? "from-amber-500 to-red-500"
          : "from-yellow-500 to-green-500"
      }`}
    >
      <div className="bg-background space-y-12 rounded-xl w-full min-h-96 p-8">
        {/* モード切り替えボタン */}
        <div className="flex gap-2 justify-center">
          <ModeTypeButton
            modeType="work"
            currentMode={mode}
            onClick={() => handleChangeMode()}
          />
          <ModeTypeButton
            modeType="break"
            currentMode={mode}
            onClick={() => handleChangeMode()}
          />
        </div>

        <p className="text-center font-bold text-9xl font-mono">
          {displayMinutes}:{displaySeconds}
        </p>

        {/* コントロールボタン */}
        <div className="flex gap-4 justify-center items-center">
          <ControlButton
            onClick={isRunning ? handleStop : handleStart}
            Icon={isRunning ? Pause : Play}
          />
          <ControlButton onClick={handleReset} Icon={RefreshCcw} />
        </div>
      </div>
    </div>
  );
};

export default Timer;