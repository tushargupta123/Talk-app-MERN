import { Box } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import ChatBox from "../components/ChatBox";
import { ChatState } from "../Context/ChatProvider";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const {user}  = ChatState();
  const navigate = useNavigate();
  
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate,userInfo]);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chat;
