import { formatEther, parseEther } from "viem";
import { useState } from "react";
import {
  FetchBalanceResult,
  fetchBalance,
  getAccount,
  readContract,
  waitForTransaction,
  writeContract,
} from "@wagmi/core";
import GambaTokenVendor from "../../../blokas/out/GambaTokenVendor.sol/GambaTokenVendor.json";
import GambaToken from "../../../blokas/out/GambaToken.sol/GambaToken.json";

const BuyTokens = () => {
  const [selling, setSelling] = useState(false);
  const [sellButton, setSellButton] = useState("Sell tokens");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSelling(true);
    setSellButton("Selling...");
    try {
      const amount: any = e.target.amount.value;

      const address: any = getAccount().address;
      const balance: FetchBalanceResult = await fetchBalance({
        address: address,
        token: "0x4f6c2533807849030752e991064349393f8B9E58",
      });

      // TODO approvals when selling (game) and selling (vendor)
      if (balance.value < amount) {
        alert("Not enough balance!");
      } else {
        const {hash} = await writeContract({
          address: "0x4f6c2533807849030752e991064349393f8B9E58",
          abi: GambaToken.abi,
          functionName: "approve",
          args: [
            "0xdBb25145CF8659d031C9975E0793388FD20b17D2",
            parseEther(amount),
          ],
        })
        await waitForTransaction({hash});
          await writeContract({
            address: "0xdBb25145CF8659d031C9975E0793388FD20b17D2",
            abi: GambaTokenVendor.abi,
            functionName: "sellTokens",
            args: [amount],
          });
          await waitForTransaction({ hash });
          setSellButton("Success!");
          setTimeout(() => {
            setSelling(false);
            setSellButton("Sell tokens");
            e.target.reset();
          }, 2000);
      }
    } catch (error) {
      console.log(error);
      setSellButton("Error!");
      setTimeout(() => {
        setSelling(false);
        setSellButton("Sell tokens");
        e.target.reset();
      }, 2000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-[#3d3d3d] rounded-full h-10 items-center flex mt-1 justify-center absolute right-0 top-1 ${selling ? 'w-[105px]' : ''}`}
    >
      <input
        className={`ml-2 mr-2 rounded-full p-1 pl-4 ${
          selling ? "hidden" : "visible"
        }`}
        type="number"
        name="amount"
        placeholder="$GMB to sell"
        min={5}
        step={0.01}
        required
      />
      <button
        className={`ml-2 mr-2 rounded-full p-1 pl-4 pr-4 bg-[#1d1d1d] text-[#ffc900] whitespace-nowrap ${
          selling && sellButton === "Selling..." ? "animate-pulse" : "animate-none"
        }`}
        disabled={selling}
      >
        {sellButton}
      </button>
    </form>
  );
};

export default BuyTokens;
