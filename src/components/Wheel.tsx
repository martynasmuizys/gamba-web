import React, { useEffect, useState } from "react";
import { Wheel } from "react-custom-roulette";
import { watchContractEvent } from "@wagmi/core";
import GambaGame from "../../../blokas/out/GambaGame.sol/GambaGame.json";

const data = [
  { option: "20", style: { backgroundColor: "red" } },
  { option: "1", style: { backgroundColor: "yellow" } },
  { option: "3", style: { backgroundColor: "green" } },
  { option: "1", style: { backgroundColor: "yellow" } },
  { option: "5", style: { backgroundColor: "blue" } },
  { option: "1", style: { backgroundColor: "yellow" } },
  { option: "3", style: { backgroundColor: "green" } },
  { option: "1", style: { backgroundColor: "yellow" } },
  { option: "10", style: { backgroundColor: "pink" } },
  { option: "1", style: { backgroundColor: "yellow" } },
  { option: "3", style: { backgroundColor: "green" } },
  { option: "1", style: { backgroundColor: "yellow" } },
  { option: "5", style: { backgroundColor: "blue" } },
  { option: "1", style: { backgroundColor: "yellow" } },
  { option: "5", style: { backgroundColor: "blue" } },
  { option: "3", style: { backgroundColor: "green" } },
  { option: "1", style: { backgroundColor: "yellow" } },
  { option: "10", style: { backgroundColor: "pink" } },
  { option: "1", style: { backgroundColor: "yellow" } },
  { option: "3", style: { backgroundColor: "green" } },
  { option: "1", style: { backgroundColor: "yellow" } },
  { option: "5", style: { backgroundColor: "blue" } },
  { option: "1", style: { backgroundColor: "yellow" } },
  { option: "3", style: { backgroundColor: "green" } },
  { option: "1", style: { backgroundColor: "yellow" } },
];

export default () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const handleSpin = (randomIndex: number) => {
    setPrizeNumber(randomIndex);
    setMustSpin(true);
  };

  useEffect(() => {
    watchContractEvent(
      {
        address: "0x366717f5eFFf376Df4DfE462716B8F1FF6d5c8C4",
        abi: GambaGame.abi,
        eventName: "WinningsCalculated",
      },
      (log: any) => {
        handleSpin(parseInt(log[0].args.randomIndex));
        console.log(log[0].args.randomIndex);
      }
    );
  });

  return (
    <>
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={data}
        onStopSpinning={() => {
          setMustSpin(false);
        }}
      />
    </>
  );
};
