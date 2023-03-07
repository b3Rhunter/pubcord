import PNS_ABI from '../abis/pns.json'
import { ethers } from 'ethers'

const Channels = ({ provider, account, dappcord, channels, currentChannel, setCurrentChannel }) => {
  const channelHandler = async (channel) => {
    // Check if user has joined
    // If they haven't allow them to mint.
    const hasJoined = await dappcord.hasJoined(channel.id, account)

    if (hasJoined) {
      setCurrentChannel(channel)
    } else {
      const signer = await provider.getSigner()
      const transaction = await dappcord.connect(signer).mint(channel.id, { value: channel.cost })
      await transaction.wait()
      const domain = window.prompt("Enter your user name:", "");
      const PNS_ADDRESS = "0x2b94d917Ca4426f516B8f7c2BF1813b58D19e89E"
      const pnsContract = new ethers.Contract(PNS_ADDRESS, PNS_ABI, signer);
      const pns = await pnsContract.registerDomain(domain);
      await pns.wait()
      console.log(pns)
      setCurrentChannel(channel)
    }
  }

  return (
    <div className="channels">
      <div className="channels__text">
        <h2>Text Channels</h2>

        <ul>
          {channels.map((channel, index) => (
            <li
              onClick={() => channelHandler(channel)} key={index}
              className={currentChannel && currentChannel.id.toString() === channel.id.toString() ? "active" : ""}>
              {channel.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="channels__voice">
        <h2>Voice Channels</h2>

        <ul>
          <li>Channel 1</li>
          <li>Channel 2</li>
          <li>Channel 3</li>
        </ul>
      </div>
    </div>
  );
}

export default Channels;