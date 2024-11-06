import { Box, Button, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { sendMessageToUnity } from "./SelectLevel";



const EscapeOverlay: React.FC = () => {


  const navigate = useNavigate();

  function resume(){
    sendMessageToUnity({type: "RESUME_GAME"})
    setTimeout(() => {
      navigate("/ingameoverlay");
    }, 200);
  }

  function restart(){
    sendMessageToUnity({type: "RESTART_GAME"})
    navigate("/ingameoverlay");
  }

  function goToLevelSelect(){
    sendMessageToUnity({type: "GO_TO_LEVEL_SELECT"});
    navigate("/ingameoverlay");
  }


  return (<>
    <style>
      {`body {
        background: rgba(0, 0, 0, 0) !important;
      }
      `}
    </style>
    <Box h={"100vh"} w={"100vw"} alignContent={"center"} background={"rgba(31, 31, 31, 0.8)"} >
      <VStack spacing={3}>
        <Button variant={"gradient"} onClick={resume}>Resume</Button>
        <Button variant={"gradient"} onClick={restart}>Restart</Button>
        <Button variant={"gradient"} onClick={goToLevelSelect}>Go to main menu</Button>
      </VStack>
    </Box>
  </>);
};  

export default EscapeOverlay;