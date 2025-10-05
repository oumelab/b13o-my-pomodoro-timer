import {Pause, Play, RefreshCcw} from "lucide-react";
import {useRef, useState} from "react";
import {ControlButton} from "./ControlButton";
import {ModeTypeButton} from "./ModeTypeButton";
import { TIMER_OPTIONS } from "@/constants";

const Timer = () => {
  // 作業/休憩モード
  const [mode, setMode] = useState<"work" | "break">("work");
  // タイマーが動いているかどうか
  const [isRunning, setIsRunning] = useState(false);
  // タイマーがスタートした時の時刻
  const [startTime, setStartTime] = useState<number | null>(null);
  // 現在の時刻
  const [now, setNow] = useState<number | null>(null);
  // タイマーが一時停止された時の残り時間
  const [pausedTimeRemaining, setPausedTimeRemaining] = useState<number | null>(
    null
  );

  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  function handleChangeMode() {
    handleReset();
    setMode(mode === "work" ? "break" : "work");
  }

  function handleStart() {
    // 後にAudio の設定を追加

    const currentTime = Date.now();
    // 停止中かつ、１時停止状態の場合
    if (!isRunning && pausedTimeRemaining) {
      setStartTime(currentTime - pausedTimeRemaining);
      setPausedTimeRemaining(null);
    } else {
      setStartTime(currentTime);
    }
    setNow(Date.now());
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    setIsRunning(true);
  }

  function handleStop() {
    // インターバル処理の停止
    clearInterval(intervalRef.current);
    // 作業中のフラグをfalse
    setIsRunning(false);

    // 停止された時点の経過時間を、pausedTimeRemainingに格納
    if (startTime != null && now != null) {
      setPausedTimeRemaining(now - startTime);
    }
  }

  function handleReset() {
    clearInterval(intervalRef.current);
    setStartTime(null);
    setNow(null);
    setIsRunning(false);
    setPausedTimeRemaining(null);
  }

  // 経過時間(秒)
  const secondsPassed =
    startTime != null && now != null ? Math.floor((now - startTime) / 1000) : 0;
  // 残り時間の秒数（設定時間ー経過時間）
  const calculateTime = TIMER_OPTIONS[mode].minutes * 60 - secondsPassed;
  const displayMinutes = Math.floor(calculateTime / 60);
  const displaySeconds =
    calculateTime % 60 < 10 ? "0" + (calculateTime % 60) : calculateTime % 60;

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
