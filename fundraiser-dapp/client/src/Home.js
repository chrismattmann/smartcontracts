import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import getWeb3 from "./getWeb3"
import FundraiserFactory from "./contracts/FundraiserFactory.json";
import Web3 from 'web3';
import FundraiserCard from "./FundraiserCard";

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
}));


const Home = () => {

    const [ funds, setFunds ] = useState([]);
    const [ contract, setContract ] = useState(null);
    const [ accounts, setAccounts ] = useState(null);
    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
    const classes = useStyles();
    
    useEffect(() => {
	init()
    }, []);

    const init = async() => {
	try{
            const networkId = await web3.eth.net.getId();
	    const deployedNetwork = FundraiserFactory.networks[networkId];
	    const accounts = await web3.eth.getAccounts();
	    const instance = new web3.eth.Contract(
		FundraiserFactory.abi,
		deployedNetwork && deployedNetwork.address
	    );
	    setContract(instance);
	    setAccounts(accounts);

            const funds = await instance.methods.fundraisers(10, 0).call();
            setFunds(funds);
	}catch(error) {
            alert('Failed to load web3, accounts, or contract. Check console for details.',);
	    console.error(error);

	}

    }

    const displayFundraisers = () => {
          return funds.map((fundraiser) => {
            return (
                <FundraiserCard
                fundraiser={fundraiser}
		key={fundraiser}
                 />
                  );
          });
   };

    
    return (
    <div className="main-container">
	    {displayFundraisers()}
    </div>
    );
}

export default Home;
