import {ThemeProvider} from "./components/theme-provider";
import Layout from "./components/Layout";
import Timer from "./components/Timer";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Layout>
        <Timer />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
