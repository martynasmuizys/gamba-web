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
import GambatokenVendor from "../../../blokas/out/GambaTokenVendor.sol/GambaTokenVendor.json";
import GambaToken from "../../../blokas/out/GambaToken.sol/GambaToken.json";

const BuyTokens = () => {
  const [buying, setBuying] = useState(false);
  const [buyButton, setBuyButton] = useState("Buy tokens");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setBuying(true);
    setBuyButton("Buying...");
    try {
      const data: any = await readContract({
        address: "0xdBb25145CF8659d031C9975E0793388FD20b17D2",
        abi: GambatokenVendor.abi,
        functionName: "getEthPrice",
        args: [1],
      });

      const eth: any = e.target.amount.value / parseFloat(data);

      const address: any = getAccount().address;
      const balance: FetchBalanceResult = await fetchBalance({
        address: address,
      });

      // TODO approvals when buying (game) and selling (vendor)
      if (balance.value < eth) {
        alert("Not enough balance!");
      } else {
        const { hash } = await writeContract({
          address: "0xdBb25145CF8659d031C9975E0793388FD20b17D2",
          abi: GambatokenVendor.abi,
          functionName: "buyTokens",
          value: parseEther(eth.toString()),
        }).then(async () => {
          const data = await readContract({
            address: "0xdBb25145CF8659d031C9975E0793388FD20b17D2",
            abi: GambatokenVendor.abi,
            functionName: "convertEthToGamba",
            args: [parseEther(eth.toString())]
          })
          console.log(data)
          let tx: any;
          tx = await writeContract({
            address: "0x4f6c2533807849030752e991064349393f8B9E58",
            abi: GambaToken.abi,
            functionName: "approve",
            args: [
              "0x366717f5eFFf376Df4DfE462716B8F1FF6d5c8C4",
              parseEther(data.toString()),
            ],
          })
        });
        await waitForTransaction({ hash });
        setBuyButton("Success!");
        setTimeout(() => {
          setBuying(false);
          setBuyButton("Buy tokens");
          e.target.reset();
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setBuyButton("Error!");
      setTimeout(() => {
        setBuying(false);
        setBuyButton("Buy tokens");
        e.target.reset();
      }, 2000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-[#3d3d3d] rounded-full h-10 items-center flex justify-center absolute right-0 bottom-1 ${buying ? 'w-[105px]' : ''}`}
    >
      <input
        className={`ml-2 mr-2 rounded-full p-1 pl-4 ${
          buying ? "hidden" : "visible"
        }`}
        type="number"
        name="amount"
        placeholder="€Eur to spend"
        min={5}
        step={0.01}
        required
      />
      <button
        className={`ml-2 mr-2 rounded-full p-1 pl-4 pr-4 bg-[#1d1d1d] text-[#ffc900] whitespace-nowrap ${
          buying && buyButton === "Buying..." ? "animate-pulse" : "animate-none"
        }`}
        disabled={buying}
      >
        {buyButton}
      </button>
    </form>
  );
};

export default BuyTokens;
