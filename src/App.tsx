import { WagmiConfig, createConfig } from "wagmi";
import { sepolia, anvil } from "./utils/Chains"
import { getDefaultConfig } from "connectkit";
import { Navbar, GambaGame } from "./components/index";
import { useEffect } from "react";

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: "ITePlgUFrtIFkCWXDevmjYmOXo12SJLe",
    walletConnectProjectId: "786c73172db2d3c45b8c4864d9ec71c6",

    // Required
    appName: "Gamba Game",
    chains: [sepolia, anvil]
  }),
);

// Pass config to React Context Provider
function App() {
  useEffect(() => {
    const unloadCallback = (event) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };
  
    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []);
  return (
    <WagmiConfig config={config}>
      <Navbar />
      <GambaGame />
      <div className="flex w-4/5 m-auto bg-[#1d1d1d] justify-center items-center text-red-500 font-bold text-[30px] mt-10 p-1 rounded-full overflow-hidden">
        GAMBLING IS GOOD! YOU CAN WIN 2000% OF YOUR MONEY AND LOSE ONLY 100% OF IT. DO THE MATH!
      </div>
    </WagmiConfig>
  )
}

export default App;