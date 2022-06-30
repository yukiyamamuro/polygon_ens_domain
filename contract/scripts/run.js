const main = async () => {
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  const domainContract = await domainContractFactory.deploy('alpha');
  await domainContract.deployed();
  console.log("Contract deployed to: ", domainContract.address);

  const price = await domainContract.price("test");
  console.log("register price will ", price);

  const txn = await domainContract.register("test", {
    value: hre.ethers.utils.parseEther('0.01'),
  });
  await txn.wait()

  const domainOwner = await domainContract.getAddress("test");
  console.log("test s owner address is ", domainOwner);

  const txn2 = await domainContract.setRecord("test", "Hello!");
  await txn2.wait();

  const record = await domainContract.getRecord("test");
  console.log("test s record is ", record);

  const [owner, superCoder] = await hre.ethers.getSigners();

  let ownerBalance = await hre.ethers.provider.getBalance(owner.address);
  console.log("Balance of owner before withdrawal:", hre.ethers.utils.formatEther(ownerBalance));

  const txn3 = await domainContract.connect(owner).withdraw();
  await txn3.wait();

  const contractBalance = await hre.ethers.provider.getBalance(domainContract.address);
  ownerBalance = await hre.ethers.provider.getBalance(owner.address);

  console.log("Contract balance after withdrawal:", hre.ethers.utils.formatEther(contractBalance));
  console.log("Balance of owner after withdrawal:", hre.ethers.utils.formatEther(ownerBalance));
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

runMain();