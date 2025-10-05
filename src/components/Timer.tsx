import {Pause, Play, RefreshCcw} from "lucide-react";
import {useEffect, useEffectEvent, useRef, useState} from "react";
import {ControlButton} from "./ControlButton";
import {ModeTypeButton} from "./ModeTypeButton";
import {TIMER_OPTIONS} from "@/constants";

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

  // インターバル処理の参照
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  // AudioContext オブジェクトは、UI のレンダーには関係ない値なので、ref で管理する
  const audioRef = useRef<AudioContext | null>(null);

  // ブラウザ API など、React コンポーネントを外部の API と接続する必要がある場合は、useEffect を使用する
  useEffect(() => {
    audioRef.current = window.AudioContext ? new window.AudioContext() : null;
    return () => {
      if (audioRef.current) {
        // AudioContext を破棄(開放)する,クリーンアップ処理
        audioRef.current.close();
      }
    };
  }, []);

  // ビープ音を再生する関数
  const playBeep = (frequency: number, duration: number) => {
    if (!audioRef.current) return;
    const oscillator = audioRef.current.createOscillator(); // 音波を作る
    const gainNode = audioRef.current.createGain(); // 音量を調整する

    oscillator.connect(gainNode); // 音波を音量調整に接続
    gainNode.connect(audioRef.current.destination); // 音量調整を音声出力に接続

    gainNode.gain.value = 0.5; // 音量を調整
    oscillator.frequency.value = frequency; // 音の高さを調整
    oscillator.start(); // 音を再生

    setTimeout(() => {
      oscillator.stop(); // 音を停止
    }, duration);
  };

  function handleReset() {
    clearInterval(intervalRef.current);
    setStartTime(null);
    setNow(null);
    setIsRunning(false);
    setPausedTimeRemaining(null);
  }

  function handleStart() {
    if (audioRef.current) {
      audioRef.current.resume();
    }

    const currentTime = Date.now();
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
    clearInterval(intervalRef.current);
    setIsRunning(false);

    if (startTime != null && now != null) {
      setPausedTimeRemaining(now - startTime);
    }
  }

  function handleChangeMode() {
    handleReset();
    setMode(mode === "work" ? "break" : "work");
  }

  // useEffectEventでラップされた関数を定義
  const playChime = useEffectEvent(() => {
    playBeep(523.25, 200);
    setTimeout(() => playBeep(659.25, 200), 200);
    setTimeout(() => playBeep(783.99, 400), 400);
  });

  // タイマーが終了した時の処理
  const onTimerComplete = useEffectEvent(() => {
    playChime();
    handleReset();
    // handleReset()の後、pausedTimeRemainingはnullになる
    setMode(mode === "work" ? "break" : "work");
    handleStart(); // handleReset後はpausedTimeRemainingがnullなので新規スタート
  });

  // タイマーが終了した時の処理（useEffect）
  useEffect(() => {
    if (startTime && now) {
      const timePassed = now - startTime;
      const totalTime = TIMER_OPTIONS[mode].minutes * 60 * 1000;

      if (timePassed >= totalTime) {
        onTimerComplete(); // Effect Eventを呼び出す
      }
    }
  }, [now, startTime, mode]);

  // インターバルのクリーンアップ（コンポーネントアンマウント時のみ）
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []); // 空の依存配列 = アンマウント時のみ実行

  // 経過時間(秒)
  const secondsPassed =
    startTime != null && now != null ? Math.floor((now - startTime) / 1000) : 0;
  // 残り時間の秒数（設定時間ー経過時間）
  const calculateTime = TIMER_OPTIONS[mode].minutes * 60 - secondsPassed;
  // 分と秒を2桁にパディング
  const displayMinutes = Math.floor(calculateTime / 60).toString().padStart(2, '0');
  const displaySeconds = (calculateTime % 60).toString().padStart(2, '0');

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
