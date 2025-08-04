const { ethers } = require("hardhat");

async function main() {
  // Deploy EduToken first
  const EduToken = await ethers.getContractFactory("EduToken");
  const eduToken = await EduToken.deploy();
  await eduToken.waitForDeployment();
  console.log("EduToken deployed to:", eduToken.target);

  // Now deploy StipendManager with EduToken's address
  const StipendManager = await ethers.getContractFactory("StipendManager");
  const stipendManager = await StipendManager.deploy(eduToken.target);
  await stipendManager.waitForDeployment();
  console.log("StipendManager deployed to:", stipendManager.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
