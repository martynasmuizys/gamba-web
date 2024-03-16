import {
  waitForTransaction,
  watchContractEvent,
  writeContract,
  readContract
} from "@wagmi/core";
import { useEffect, useState } from "react";
import GambaGame from "../../../blokas/out/GambaGame.sol/GambaGame.json";

const LockFunds = () => {
  const [spinning, setSpinning] = useState(false);
  const [button, setButton] = useState("Lock");
  const [amounts, setAmounts] = useState([0, 0, 0, 0, 0]);
  let lockAmounts: number[] = [];
  let pageLoaded: boolean;

  useEffect(() => {
    watchContractEvent(
      {
        address: "0x366717f5eFFf376Df4DfE462716B8F1FF6d5c8C4",
        abi: GambaGame.abi,
        eventName: "RequestedCalculateWinnings",
      },
      () => {
        setSpinning(true);
        setButton("Wheel is spinning!");
      }
    );

    watchContractEvent(
      {
        address: "0x366717f5eFFf376Df4DfE462716B8F1FF6d5c8C4",
        abi: GambaGame.abi,
        eventName: "WinningsCalculated",
      },
      () => {
        setTimeout(() => {
          setSpinning(false);
          setButton("Lock");
          setAmounts([0, 0, 0, 0, 0]);
        }, 12000);
      }
    );
  });

  const handleClick = async (e: any) => {
    e.preventDefault();
    lockAmounts[0] =
      e.target.amount1.value !== "" ? parseInt(e.target.amount1.value) : 0;
    lockAmounts[1] =
      e.target.amount2.value !== "" ? parseInt(e.target.amount2.value) : 0;
    lockAmounts[2] =
      e.target.amount3.value !== "" ? parseInt(e.target.amount3.value) : 0;
    lockAmounts[3] =
      e.target.amount4.value !== "" ? parseInt(e.target.amount4.value) : 0;
    lockAmounts[4] =
      e.target.amount5.value !== "" ? parseInt(e.target.amount5.value) : 0;

    console.log(lockAmounts);

    if (
      lockAmounts[0] == 0 &&
      lockAmounts[1] == 0 &&
      lockAmounts[2] == 0 &&
      lockAmounts[3] == 0 &&
      lockAmounts[4] == 0
    ) {
      alert("No values provided!");
    } else {
      try {
        const { hash } = await writeContract({
          address: "0x366717f5eFFf376Df4DfE462716B8F1FF6d5c8C4",
          abi: GambaGame.abi,
          functionName: "bid",
          args: [lockAmounts],
        });
        await waitForTransaction({ hash });
        e.target.reset();
        setAmounts([
          amounts[0] + lockAmounts[0],
          amounts[1] + lockAmounts[1],
          amounts[2] + lockAmounts[2],
          amounts[3] + lockAmounts[3],
          amounts[4] + lockAmounts[4],
        ]);
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  useEffect(() => {
    async function isWheelSpinning() {
      const data: any = await readContract({
        address: "0x366717f5eFFf376Df4DfE462716B8F1FF6d5c8C4",
        abi: GambaGame.abi,
        functionName: "getWheelState"
      })

      if (data == 1) {
          setSpinning(true);
          setButton("Wheel is spinning!");
      }
    }
    isWheelSpinning();
  }, [pageLoaded])
  pageLoaded = true;

  return (
    <div className="grid grid-cols-2">
      <div>
        <form
          className="bg-[#3d3d3d] rounded-3xl h-[400px] p-10 ml-10 w-[300px]"
          onSubmit={handleClick}
        >
          <div className="grid grid-cols-1 gap-4 mt-6">
            <input
              className={`ml-2 mr-2 rounded-full p-1 pl-4`}
              type="number"
              name="amount1"
              placeholder="Bet on 1"
              min={0}
              step={1}
              disabled={spinning}
            />
            <input
              className={`ml-2 mr-2 rounded-full p-1 pl-4`}
              type="number"
              name="amount2"
              placeholder="Bet on 3"
              min={0}
              step={1}
              disabled={spinning}
            />
            <input
              className={`ml-2 mr-2 rounded-full p-1 pl-4`}
              type="number"
              name="amount3"
              placeholder="Bet on 5"
              min={0}
              step={1}
              disabled={spinning}
            />
            <input
              className={`ml-2 mr-2 rounded-full p-1 pl-4`}
              type="number"
              name="amount4"
              placeholder="Bet on 10"
              min={0}
              step={1}
              disabled={spinning}
            />
            <input
              className={`ml-2 mr-2 rounded-full p-1 pl-4`}
              type="number"
              name="amount5"
              placeholder="Bet on 20"
              min={0}
              step={1}
              disabled={spinning}
            />
            <button
              className={`ml-2 mr-2 rounded-full p-1 pl-4 pr-4 bg-[#1d1d1d] text-[#ffc900] whitespace-nowrap`}
              disabled={spinning}
            >
              {button}
            </button>
          </div>
        </form>
      </div>
      <div className="bg-[#3d3d3d] rounded-3xl h-[400px] p-10 ml-40 w-[300px]">
        <div className="grid grid-cols-1 gap-4 mt-6">
          <h1 className="p-2 bg-[#1d1d1d] rounded-full text-yellow-500">Amount bid on 1: {amounts[0]}</h1>
          <h1 className="p-2 bg-[#1d1d1d] rounded-full text-green-500">Amount bid on 3: {amounts[1]}</h1>
          <h1 className="p-2 bg-[#1d1d1d] rounded-full text-blue-500">Amount bid on 5: {amounts[2]}</h1>
          <h1 className="p-2 bg-[#1d1d1d] rounded-full text-pink-500">Amount bid on 10: {amounts[3]}</h1>
          <h1 className="p-2 bg-[#1d1d1d] rounded-full text-red-500">Amount bid on 20: {amounts[4]}</h1>
        </div>
      </div>
    </div>
  );
};

export default LockFunds;
