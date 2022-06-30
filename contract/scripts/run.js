const main = async () => {
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  const doamainContract = await domainContractFactory.deploy('alpha');
  await doamainContract.deployed();
  console.log("Contract deployed to: ", doamainContract.address);

  const price = await doamainContract.price("test");
  console.log("register price will ", price);

  const txn = await doamainContract.register("test", {
    value: hre.ethers.utils.parseEther('0.01'),
  });
  await txn.wait()

  const domainOwner = await doamainContract.getAddress("test");
  console.log("test s owner address is ", domainOwner);

  const txn2 = await doamainContract.setRecord("test", "Hello!");
  await txn2.wait();

  const record = await doamainContract.getRecord("test");
  console.log("test s record is ", record)
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