import { ethers } from "ethers";
import { FC, useEffect, useState } from "react";
import { OutlinedInput, Grid, Typography, Card, Button, Stack, InputAdornment } from "@mui/material";

import contractAbi from "./abi/Domains.json";

const tld = ".alpha";
const CONTRACT_ADDRESS = "0xACaab6b03A2a6e7E2456c3E34C82334515A2f020";

type Prop = {
  setMints: any;
}

export const DomainForm: FC<Prop> = ({ setMints }) => {
  const [domain, setDomain] = useState("");
  const [record, setRecord] = useState("");

  const mintDomain = async () => {
    if (!domain) {
      return;
    }
    if (domain.length < 3) {
      alert("Domain must be at least 3 characters long");
      return;
    }
    const price =
      domain.length === 3 ? "0.05" : domain.length === 4 ? "0.03" : "0.01";
    console.log("Minting domain", domain, "with price", price);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractAbi.abi,
          signer
        );

        console.log("Going to pop wallet now to pay gas...");
        let tx = await contract.register(domain, {
          value: ethers.utils.parseEther(price),
        });
        const receipt = await tx.wait();

        if (receipt.status === 1) {
          console.log(
            "Domain minted! https://mumbai.polygonscan.com/tx/" + tx.hash
          );
          tx = await contract.setRecord(domain, record);
          await tx.wait();

          console.log("Record set! https://mumbai.polygonscan.com/tx/" + tx.hash);
          setRecord("");
          setDomain("");
        } else {
          alert("Transaction failed! Please try again");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateDomain = async () => {
    if (!record || !domain) { return }
    console.log("Updating domain", domain, "with record", record);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

        let tx = await contract.setRecord(domain, record);
        await tx.wait();
        console.log("Record set https://mumbai.polygonscan.com/tx/"+tx.hash);

        fetchMints();
        setRecord('');
        setDomain('');
      }
    } catch(error) {
      console.log(error);
    }
  }

  const fetchMints = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

        const names = await contract.getAllNames();

        const mintRecords = await Promise.all(names.map(async (name: any) => {
          const mintRecord = await contract.records(name);
          const owner = await contract.domains(name);
          return {
            id: names.indexOf(name),
            name: name,
            record: mintRecord,
            owner: owner,
          };
        }));

        console.log("MINTS FETCHED ", mintRecords);
        setMints(mintRecords);
      }
    } catch(error){
      console.log(error);
    }
  }

  useEffect(()=>{
    fetchMints();
  }, [])

  return(
    <Card sx={{ padding: "20px", width: "600px" }}>
      <Stack spacing={3}>
        <Typography variant="h3">Get Alpha domain!!</Typography>
          <OutlinedInput
            type="text"
            value={domain}
            label="domain"
            placeholder="domain"
            sx={{ width: "400px" }}
            endAdornment={<InputAdornment position="end">{tld}</InputAdornment>}
            onChange={(e) => setDomain(e.target.value)}
          />
          <OutlinedInput
            type="text"
            value={record}
            label="description"
            placeholder="whats ur alpha power"
            sx={{ width: "400px" }}
            onChange={(e) => setRecord(e.target.value)}
          />

          <Grid container spacing={1}>
            <Grid item>
              <Button
                variant="contained"
                onClick={mintDomain}
              >
                Mint
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={updateDomain}
                >
                Update Comment
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={fetchMints}
              >
                Refetch
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </Card>
  )
}