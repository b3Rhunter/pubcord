import { useEffect, useState, useRef } from 'react'
import { io } from "socket.io-client"
import PNS_ABI from '../abis/pns.json'
import { ethers } from 'ethers'

// Assets
import person from '../assets/person.svg'
import send from '../assets/send.svg'

// Socket
const socket = io('ws://localhost:3030')

const Messages = ({ account, messages, currentChannel}) => {
  const [message, setMessage] = useState("")
  const [pnsName, setPnsName] = useState("")

  const messageEndRef = useRef(null)

  const sendMessage = async (e) => {
    e.preventDefault()

    const messageObj = {
      channel: currentChannel.id.toString(),
      account: account,
      text: message
    }

    if (message !== "") {
      socket.emit('new message', messageObj)
    }

    setMessage("")
  }

  const scrollHandler = () => {
    setTimeout(() => {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }, 500)
  }

  useEffect(() => {
    scrollHandler()
    getPns()
  })


  const getPns = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    const PNS_ADDRESS = "0x2b94d917Ca4426f516B8f7c2BF1813b58D19e89E"
    const pnsContract = new ethers.Contract(PNS_ADDRESS, PNS_ABI, signer);
    const pns = await pnsContract.getPrimaryDomain(account);
    console.log(pns)
    setPnsName(pns)
  }


  return (
    <div className="text">
      <div className="messages">

        {currentChannel && messages.filter(message => message.channel === currentChannel.id.toString()).map((message, index) => (
          <div className="message" key={index}>
            <img src={person} alt="Person" />
            <div className="message_content">
              <h3>{pnsName || message.account.slice(0, 6) + '...' + message.account.slice(38, 42)}</h3>
              <p>
                {message.text}
              </p>
            </div>
          </div>
        ))}

        <div ref={messageEndRef} />

      </div>

      <form onSubmit={sendMessage}>
        {currentChannel && account ? (
          <input type="text" value={message} placeholder={`Message #${currentChannel.name}`} onChange={(e) => setMessage(e.target.value)} />
        ) : (
          <input type="text" value="" placeholder={`Please Connect Wallet / Join the Channel`} disabled />
        )}

        <button type="submit">
          <img src={send} alt="Send Message" />
        </button>
      </form>
    </div>
  );
}

export default Messages;