import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import PNS_ABI from '../abis/pns.json';
import ethereum from '../assets/ethereum.svg';

const Message = ({ account, text }) => {
  const [pnsName, setPnsName] = useState('');
  const [ensName, setEnsName] = useState('');

  useEffect(() => {
    getPns();
    getEns();
  }, [account]);

  const getPns = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    const PNS_ADDRESS = '0xd706AaEB22757c9694348BaB683D2D308E7a5Fe8';
    const pnsContract = new ethers.Contract(PNS_ADDRESS, PNS_ABI, signer);
    const pns = await pnsContract.getPrimaryDomain(account);
    setPnsName(pns);
  };

  const getEns = async () => {
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
  };

  return (
    <div className="message">
      <img src={ethereum} alt="Person" />
      <div className="message_content">
        <h3>{pnsName || ensName}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default Message;
