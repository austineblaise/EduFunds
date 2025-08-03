const hre = require("hardhat");

async function main() {
  const StipendManager = await hre.ethers.getContractFactory("StipendManager");
  const contract = await StipendManager.deploy();
  await contract.deployed();

  console.log("StipendManager deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
