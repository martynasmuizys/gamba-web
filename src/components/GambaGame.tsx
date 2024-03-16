import { useState, useEffect } from "react";
import LockFunds from "./LockFunds";
import Wheel from "./Wheel";
import {
  getAccount,
  readContract,
  waitForTransaction,
  watchContractEvent,
  writeContract,
} from "@wagmi/core";
import GambaGameABI from "../../../blokas/out/GambaGame.sol/GambaGame.json";
import { useAccount } from "wagmi";

const GambaGame = () => {
  const [withdraw, setWithdraw] = useState("0");

  useEffect(() => {
    async function getFunds() {
      const data: any = await readContract({
        address: "0x366717f5eFFf376Df4DfE462716B8F1FF6d5c8C4",
        abi: GambaGameABI.abi,
        functionName: "getWithdrawableWinnings",
        account: getAccount().address,
      });
      console.log(data);
      setWithdraw(data.toString());
    }
    if (withdraw === "0") {
      getFunds();
    }
    watchContractEvent(
      {
        address: "0x366717f5eFFf376Df4DfE462716B8F1FF6d5c8C4",
        abi: GambaGameABI.abi,
        eventName: "WinningsCalculated",
      },
      () => {
        setTimeout(async () => {
          const data: any = await readContract({
            address: "0x366717f5eFFf376Df4DfE462716B8F1FF6d5c8C4",
            abi: GambaGameABI.abi,
            functionName: "getWithdrawableWinnings",
            account: getAccount().address,
          });
          setWithdraw(data.toString());
        }, 12000);
      }
    );

    watchContractEvent(
      {
        address: "0x366717f5eFFf376Df4DfE462716B8F1FF6d5c8C4",
        abi: GambaGameABI.abi,
        eventName: "FundsRedeemed",
      },
      () => {
        setWithdraw("0");
      }
    );
  });

  const handleClick = async () => {
    if (withdraw == "0") {
      alert("Nothing to withdraw!");
    } else {
      const { hash } = await writeContract({
        address: "0x366717f5eFFf376Df4DfE462716B8F1FF6d5c8C4",
        abi: GambaGameABI.abi,
        functionName: "redeem",
      });
      await waitForTransaction({ hash });
    }
  };

  return (
    <div
      className={`h-[650px] w-[65%] m-auto bg-[#1d1d1d] overflow-hidden mt-10 rounded-3xl flex-nowrap ${
        !useAccount().isConnected
          ? "transition-opacity ease-out opacity-0"
          : "transition-opacity ease-in opacity-100"
      }`}
    >
      <div className="flex items-center justify-center mt-10 bg-[#1d1d1d] p-3 w-3/4 ml-10 mr-auto">
        <Wheel />
        <LockFunds />
      </div>
      <div className="p-2 w-2/5 rounded-full ml-7">
        <div className="flex items-center justify-center mt-8 ml-auto mr-auto bg-[#3d3d3d] text-[20px] w-[400px] rounded-full text-[#ffc900]">
          Tokens available to withdraw: {withdraw}
        </div>
        <button
          className="flex items-center justify-center p-2 mt-3 ml-auto mr-auto mb-10 bg-[#3d3d3d] text-[16px] w-[200px] rounded-full text-[#ffc900]"
          onClick={handleClick}
        >
          Withdraw winnings
        </button>
      </div>
    </div>
  );
};

export default GambaGame;
