import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { io } from "socket.io-client"

// Components
import Navigation from './components/Navigation'
import Servers from './components/Servers'
import Channels from './components/Channels'
import Messages from './components/Messages'

// ABIs
import Dappcord from './abis/Dappcord.json'
import pnsABI from './abis/pns.json'


const contractAddress = '0x8ca296531808De4b70f08bbDefd387d3f446846D'


// Socket
const socket = io('https://pubcord-server.herokuapp.com/');

function App() {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)

  const [dappcord, setDappcord] = useState(null)
  const [channels, setChannels] = useState([])

  const [currentChannel, setCurrentChannel] = useState(null)
  const [messages, setMessages] = useState([])

  const [pnsContract, setPnsContract] = useState(null)
  

  const pnsAddress = '0xF2e0691A60712Ea90CE55F880d25d66827B994B2'

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const network = await provider.getNetwork()
    const dappcord = new ethers.Contract(contractAddress, Dappcord, provider)
    const pns = new ethers.Contract(pnsAddress, pnsABI, provider)
    setDappcord(dappcord)
    setPnsContract(pns)

    const totalChannels = await dappcord.totalChannels()
    const channels = []

    for (var i = 1; i <= totalChannels; i++) {
      const channel = await dappcord.getChannel(i)
      channels.push(channel)
    }

    setChannels(channels)

    window.ethereum.on('accountsChanged', async () => {
      window.location.reload()
    })
  }

  useEffect(() => {
    loadBlockchainData()

    // --> https://socket.io/how-to/use-with-react-hooks

    socket.on("connect", () => {
      socket.emit('get messages')
    })

    socket.on('new message', (messages) => {
      setMessages(messages)
    })

    socket.on('get messages', (messages) => {
      setMessages(messages)
    })

    return () => {
      socket.off('connect')
      socket.off('new message')
      socket.off('get messages')
    }
  }, [])

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />

      <main>
        <Servers />

        <Channels
          provider={provider}
          account={account}
          dappcord={dappcord}
          channels={channels}
          currentChannel={currentChannel}
          setCurrentChannel={setCurrentChannel}
        />

        <Messages account={account} messages={messages} currentChannel={currentChannel} />
      </main>
    </div>
  );
}

export default App;
