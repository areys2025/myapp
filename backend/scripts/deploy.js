const hre = require("hardhat");

async function main() {
  const Payment = await hre.ethers.getContractFactory("Payment");
  const payment = await Payment.deploy();
console.log("Payment deployed to:", await payment.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
