import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import PNS_ABI from '../abis/pns.json';
import ethereum from '../assets/ethereum.svg';

const Message = ({ account, text }) => {
  const [pnsName, setPnsName] = useState('');
  const [ensName, setEnsName] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [tokenId, setTokenId] = useState('');

  useEffect(() => {
    getPns();
    getEns();
  }, [account]);

  useEffect(() => {
    async function getImageSrc() {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contractAddress = '0xF2e0691A60712Ea90CE55F880d25d66827B994B2';
        const contract = new ethers.Contract(contractAddress, PNS_ABI, signer);
        const address = signer.getAddress();
        const balance = await contract.balanceOf(address);
        if (balance > 0) {
          const tokenIds = await Promise.all(
            Array.from({ length: balance }, (_, i) =>
              contract.tokenOfOwnerByIndex(address, i)
              )
              );
              setTokenId(tokenIds[0])
              return tokenIds[0];
              }
              } catch (error) {
              console.error(error);
              }
              }
              if (account) {
                getImageSrc();
              }
            }, [account]);

  useEffect(() => {
    async function getImageSrc() {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner();
        const contractAddress = '0xF2e0691A60712Ea90CE55F880d25d66827B994B2';
        const contract = new ethers.Contract(contractAddress, PNS_ABI, signer);
        const tokenUri = await contract.tokenURI(tokenId);
        const response = await fetch(tokenUri);
        const json = await response.json();
        console.log(tokenUri)
        setImageSrc(json.image);
      } catch (error) {
        console.error(error);
      }
    }

    if (tokenId) {
      getImageSrc();
    }
  }, [tokenId]);

  const getPns = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    const PNS_ADDRESS = '0xF2e0691A60712Ea90CE55F880d25d66827B994B2';
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
      <div className="user-image-container" style={{ backgroundImage: `url(${imageSrc || ethereum})` }} />
      <div className="message_content">
        <h3>{pnsName || ensName}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default Message;
