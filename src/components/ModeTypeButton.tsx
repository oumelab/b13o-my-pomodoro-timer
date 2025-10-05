import { TIMER_OPTIONS } from "../constants";
import { Button } from "./ui/button";

type ModeTypeButtonProps = {
  modeType: "work" | "break";
  currentMode: "work" | "break";
  onClick: () => void;
};

export const ModeTypeButton = (props: ModeTypeButtonProps) => {
  return (
    <Button
      variant="ghost"
      onClick={props.onClick}
      className={`bg-transparent border border-muted-foreground text-3xl h-16 w-16 rounded-full flex justify-center items-center ${
        props.currentMode === props.modeType ? "border border-foreground" : ""
      }`}
    >
      {TIMER_OPTIONS[props.modeType].label}
    </Button>
  );
};