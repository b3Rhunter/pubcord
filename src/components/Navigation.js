import { useState } from 'react'
import { ethers } from 'ethers'
import PNS_ABI from '../abis/pns.json'

const Navigation = ({ account, setAccount }) => {

  const [pnsName, setName] = useState("")
  const [ensName, setEnsName] = useState("")

  const connectHandler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    console.log(account)
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const PNS_ADDRESS = "0xF2e0691A60712Ea90CE55F880d25d66827B994B2"
      const pnsContract = new ethers.Contract(PNS_ADDRESS, PNS_ABI, signer);
      const pns = await pnsContract.getPrimaryDomain(account);
      console.log(pns)
      setName(pns)
      const { ethereum } = window;
      if (ethereum) {
        const ensProvider = new ethers.providers.InfuraProvider('mainnet');
        const displayAddress = account?.substr(0, 6) + '...';
        const ens = await ensProvider.lookupAddress(account);
        if (ens !== null) {
          setEnsName(ens);
        } else {
          setEnsName(displayAddress);
        }
      }
    } catch (err) {
      console.log(err)
    }

    setAccount(account)
    
  }

  return (
    <nav>
      <div className='nav__brand'>
        <h1>PubCord</h1>
      </div>

      {account ? (
        <button
          type="button"
          className='nav__connect'
        >
          {pnsName || ensName}
        </button>
      ) : (
        <button
          type="button"
          className='nav__connect'
          onClick={connectHandler}
        >
          Connect
        </button>
      )}
    </nav>
  );
}

export default Navigation;