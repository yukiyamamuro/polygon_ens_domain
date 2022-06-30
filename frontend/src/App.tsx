import { FC, useEffect, useState } from "react";
import {  Button, Card, Container, Grid, IconButton, Paper, Typography } from "@mui/material";
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';

import { Ethereum } from './types/Ethereum';

import polygonLogo from './assets/polygonlogo.png';
import ethLogo from './assets/ethlogo.png';
import { chainIdType, networks } from './utils/networks';

import { DomainForm } from "./DomainForm";
import { NotConnectedContainer } from "./NotConnectedContainer";

declare global {
  interface Window {
    ethereum: Ethereum;
  }
}
const CONTRACT_ADDRESS = "0xACaab6b03A2a6e7E2456c3E34C82334515A2f020";

export const App: FC = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [network, setNetwork] = useState("");
  const [mints, setMints] = useState<any[]>();

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

    const chainId: chainIdType = await ethereum.request({ method: 'eth_chainId' });
    setNetwork(networks[chainId]);

    ethereum.on('chainChanged', handleChainCanged);
  };

  const handleChainCanged = () => {
    window.location.reload();
  }

  const switchNetwork = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x13881' }],
        });
      } catch (error: any) {
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x13881',
                  chainName: 'Polygon Mumbai Testnet',
                  rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                  nativeCurrency: {
                      name: "Mumbai Matic",
                      symbol: "MATIC",
                      decimals: 18
                  },
                  blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
                },
              ],
            });
          } catch (error) {
            console.log(error);
          }
        }
        console.log(error);
      }
    } else {
      alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <Container sx={{ margin: "40px"}}>
      <Grid container spacing={4}>
        <Grid item sm={8}>
          <Typography variant="h2">Alpha Name Service</Typography>
        </Grid>
        <Grid item sm={3}>
          <Paper elevation={3} sx={{ margin: "5px", padding: "15px", alignmentBaseline: "auto", borderRadius: "50px" }}>
            <Grid container spacing={1}>
              <Grid item>
                <img
                  alt="Network logo"
                  height={"30px"}
                  src={ network.includes("Polygon") ? polygonLogo : ethLogo} />
              </Grid>
              <Grid item>
                { currentAccount ? <p> Wallet: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)} </p> : <p> Not connected </p> }
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {!currentAccount &&
        <NotConnectedContainer setCurrentAccount={setCurrentAccount} />
      }

      <Container sx={{ marginTop: "30px"}}>
        {currentAccount && network === 'Polygon Mumbai Testnet' ?
          (<DomainForm setMints={setMints}/>) : (
            <Container>
              <Typography>connect Polygon Mumbai Testnet</Typography>
              <Button variant="outlined" onClick={switchNetwork}>Switch network</Button>
            </Container>
          )
        }
      </Container>

      <Grid container spacing={3} margin={"10px"}>
        { mints && mints.map((mint, index) => {
          return (
            <Grid item key={index}>
              <Card sx={{ width: "200px", height: "100px", padding: "15px" }}>
                <Grid container>
                  <Grid item>
                    <a href={`https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS}/${mint.id}`} target="_blank" rel="noopener noreferrer">
                      <Typography>{' '}{mint.name}{'.alpha '}</Typography>
                    </a>
                  </Grid>
                  <Grid item>
                    { mint.owner.toLowerCase() === currentAccount.toLowerCase() ?
                      <IconButton onClick={() => {console.log('clicked')}}>
                        <ModeEditOutlineIcon/>
                      </IconButton>
                    :
                    null
                    }
                  </Grid>
                </Grid>
                <Typography> {mint.record} </Typography>
              </Card>
            </Grid>)
          })}
        </Grid>
    </Container>
  )
}
