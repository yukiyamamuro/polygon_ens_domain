import { Box, Button, Stack } from "@mui/material";
import { FC } from "react";

export type Prop = {
  setCurrentAccount: React.Dispatch<React.SetStateAction<string>>

}

export const NotConnectedContainer: FC<Prop> = ({ setCurrentAccount }) => {
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask -> https://metamask.io/");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Stack width={"500px"}>
      <Box>
        <img
          src="https://media.giphy.com/media/X1wdw6wqIePpm/giphy.gif"
          alt="Alpha gif"
        />
      </Box>
      <Button variant="contained" onClick={connectWallet}>
        Connect Wallet
      </Button>
    </Stack>
  )
};