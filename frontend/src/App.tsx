import { Container, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { DomainForm } from "./DomainForm";
import { NotConnectedContainer } from "./NotConnectedContainer";

import { Ethereum } from './types/Ethereum';

declare global {
  interface Window {
    ethereum: Ethereum;
  }
}

export const App: FC = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Get MetaMask -> https://metamask.io/");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
      const account = accounts[0];
      setCurrentAccount(account);
    } else {
      alert("No authorized account found");
    }
  };



  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <Container sx={{ margin: "40px"}}>
      <Typography variant="h2">Alpha Name Service</Typography>

      {!currentAccount &&
        <NotConnectedContainer setCurrentAccount={setCurrentAccount} />
      }

      <Container sx={{ marginTop: "30px"}}>
        {currentAccount &&
          <DomainForm/>
        }
      </Container>
    </Container>
  )
}
