import { ethers } from "hardhat";

async function main() {
  const unlockTime = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour from now

  const Lock = await ethers.getContractFactory("Lock");
  const lock = await Lock.deploy(unlockTime, { value: ethers.parseEther("0.01") });

  await lock.waitForDeployment();

  console.log(`Lock contract deployed to: ${await lock.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
