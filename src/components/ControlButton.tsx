import { Button } from "./ui/button";

type ControlButtonProps = {
  onClick: () => void;
  Icon: React.ElementType;
};
export const ControlButton = (props: ControlButtonProps) => {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={props.onClick}
      className="opacity-90 p-3 rounded-full hover:opacity-100 transition"
    >
      <props.Icon className="" />
    </Button>
  );
};