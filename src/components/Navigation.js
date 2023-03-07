import { useState } from 'react'
import { ethers } from 'ethers'
import PNS_ABI from '../abis/pns.json'

const Navigation = ({ account, setAccount }) => {

  const [pnsName, setName] = useState("")

  const connectHandler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    console.log(account)
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const PNS_ADDRESS = "0x2b94d917Ca4426f516B8f7c2BF1813b58D19e89E"
      const pnsContract = new ethers.Contract(PNS_ADDRESS, PNS_ABI, signer);
      const pns = await pnsContract.getPrimaryDomain(account);
      console.log(pns)
      setName(pns)
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
          {pnsName || account.slice(0, 6) + '...' + account.slice(38, 42)}
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