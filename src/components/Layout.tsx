import GithubMark from "./ui/github-mark";
import {ModeToggle} from "./mode-toggle";
import {Button} from "./ui/button";

type LayoutProps = {
  children?: React.ReactNode;
};

const Layout = (props: LayoutProps) => {
  return (
    <main className="min-h-screen px-5 space-y-12">
      <header className="max-w-screen-lg mx-auto py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">My Pomodoro Timer</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <a href="#" target="_bank">
              <GithubMark className="fill-foreground size-5" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>
          <ModeToggle />
        </div>
      </header>
      {/* Hero Section */}
      <div className="lg:text-center space-y-8">
        {/* <h1 className="text-5xl font-bold">My Pomodoro Timer</h1> */}
        <p className="text-sm md:text-base w-fit mx-auto leading-loose">
          ポモドーロタイマーは、集中力を高める時間管理テクニックです ⏰
          <br />
          25分間の作業と、5分間の休憩を繰り返し、生産性を向上させましょう！
          </p>
      </div>

      {/* Timer */}
      {props.children}

      {/* Footer */}
      <footer className="sticky bottom-0 top-full text-center pb-8">
        <p className="text-muted-foreground">
          Created by{" "}
          <a
            className="text-muted-foreground hover:text-primary underline underline-offset-4"
            href="#" // TODO: Replace with your actual URL
            target="_blank"
            rel="noreferrer"
          >
            @your-handle
          </a>{" "}
          &copy; 2025
        </p>
      </footer>
    </main>
  );
};

export default Layout;
