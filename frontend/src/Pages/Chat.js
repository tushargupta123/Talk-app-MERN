import axios from 'axios';

const Chat = () => {

    const fetchChats = async() => {
        const data = await axios.get('/')
    }

  return (
    <div>Chat</div>
  )
}

export default Chat