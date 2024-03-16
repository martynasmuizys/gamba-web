import { fetchBalance, getAccount, readContract } from "@wagmi/core";
import { useEffect, useState } from "react";
import GambaToken from "../../../blokas/out/GambaToken.sol/GambaToken.json";

const GambaBalance = () => {
  const [ticking, setTicking] = useState(true),
    [count, setCount] = useState(0);
  const [balance, setBalance] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => ticking && setCount(count + 1), 30e3);
    async function getBalance() {
      const address: any = getAccount().address;
      const data = await fetchBalance({
        address: address,
        token: "0x4f6c2533807849030752e991064349393f8B9E58",
      });
      setBalance(data.formatted);
    }
    getBalance();
    return () => clearTimeout(timer);
  }, [count, ticking]);

  return <div className="ml-44 text-[#ffc900] rounded-full bg-[#3d3d3d] p-4 text-[16px] flex">$GMB balance: ${balance}</div>;
};

export default GambaBalance;
