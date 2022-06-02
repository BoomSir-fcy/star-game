export const RechargeToken = async (
  masterChefContract: any,
  tokenAddress: any,
  amount: any,
  ChainToken: any,
) => {
  let tx;
  console.log(ChainToken, amount, '11');
  if (ChainToken) {
    tx = await masterChefContract.depositBNB({
      value: amount,
    });
  } else {
    tx = await masterChefContract.deposit(tokenAddress, amount);
  }
  const receipt = await tx.wait();
  return receipt.status;
};
