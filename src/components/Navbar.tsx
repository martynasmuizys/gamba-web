import { ConnectKitProvider, ConnectKitButton } from "connectkit";
import BuyTokens from "./BuyTokens";
import SellTokens from "./SellTokens";
import { useAccount } from "wagmi";
import GambaBalance from "./GambaBalance";

const Navbar = () => {
  return (
    <nav className="w-3/4 h-28 mt-3 ml-auto mr-auto flex justify-between items-center navbar bg-[#1d1d1d] rounded-full">
      <img
        src="https://media.tenor.com/4OYd5OlYR9wAAAAC/gamba-xqc.gif"
        alt="x"
        width={100}
        className="ml-10 rounded-full"
      />
      <div className="ml-[155px] font-bold p-auto text-[#ffc900] text-[30px] absolute whitespace-nowrap">
        Gamba Game
      </div>
      <div
        className={`${
          !useAccount().isConnected
            ? "transition-opacity ease-out opacity-0"
            : "transition-opacity ease-in opacity-100"
        }`}
      >
        <GambaBalance />
      </div>
      <div className="relative flex items-center">
        <div
          className={`relative mr-4 gap-y-10 ${
            !useAccount().isConnected
              ? "transition-opacity ease-out opacity-0"
              : "transition-opacity ease-in opacity-100"
          }`}
        >
          <BuyTokens />
          <SellTokens />
        </div>
        <div className="relative mr-10">
          <ConnectKitProvider
            customTheme={{
              "--ck-body-background": "rgba(29,29,29)",
              "--ck-connectbutton-border-radius": "42px",
              "--ck-body-color": "rgba(255,201,0)",
              "--ck-connectbutton-color": "rgba(255,201,0)",
            }}
          >
            <ConnectKitButton />
          </ConnectKitProvider>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
