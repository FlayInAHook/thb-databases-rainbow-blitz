import { Box, Button, Center, Heading, Input, VStack } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
//import CLOUDS from 'vanta/dist/vanta.clouds.min';
import { customColorModeAtom, requestUniqueID, UnityMessage,} from './Datastorage';
import { sensitivityAtom } from './SettingsPage';


function sendMessageToUnity(message: object) {
  if (!window.vuplex) return console.error("No Vuplex Webview found!");
  window.vuplex.postMessage(message);
}


const MainPage: React.FC = () => {
  const [vantaEffect, setVantaEffect] = useState<any>(null)
  const [customColorMode] = useAtom(customColorModeAtom);
 
  const backgroundRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [uniqueID, setUniqueID] = useState<string>("");


  useEffect(() => {
    if (!window.vuplex) {
      console.error("Too bad! This is not a Vuplex Webview!");
      setUniqueID("NO_VUPLEX");
      return;
    }

    requestUniqueID();
    window.vuplex.addEventListener("message", handleUnityMessage);
    return () => window.removeEventListener("message", handleUnityMessage);
  }, []);


  const vantaConfig = {
    el: backgroundRef.current,
    THREE: THREE,
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    speed: 0.5,
    scaleMobile: 1.00,
    backgroundColor: 0x8b8b8b,
  skyColor: 0x0,
  cloudColor: 0xb0b0b,
  cloudShadowColor: 0xffffff,
  sunColor: 0x0,
  sunGlareColor: 0x0,
  sunlightColor: 0xcfcccc,
    
  };

  useEffect(() => {
    if (!backgroundRef.current) return;
    if (vantaEffect) return;
      //setVantaEffect(CLOUDS({...vantaConfig, el: backgroundRef.current}));
  }, [backgroundRef]);


  function changeVantaColor(hexColor: string) {
    if (!vantaEffect) return;
    //setVantaEffect(CLOUDS({...vantaConfig, sunColor: hexColor}));
    const intColor = Number("0x" + hexColor.replace("#", ""));
    vantaEffect.setOptions({...vantaConfig, sunColor: intColor});
  }


  const [sensitivity, setSensitivity] = useAtom(sensitivityAtom);

  useEffect(() => {
    sendMessageToUnity({type: "SENSITIVITY", content: sensitivity});
  }, [sensitivity]);




  function handleUnityMessage(_event: any) {
    //console.log("Unity Message", _event);
    const event = JSON.parse(_event.data) as UnityMessage;
    if (event.type == "UNIQUE_ID"){
      setUniqueID(event.data);
    }
  }


  function rederNormalMainPage() {
    return <Center>
        <VStack>
          <Heading variant={"gradient"} size='4xl' p={"5"} mt={"30%"} mb={"10%"} >Rainbow Blitz</Heading>
          <Button variant={"gradientTransparent"} fontSize={"xx-large"} width={"fit-content"} height={"80px"} onClick={() => navigate("selectLevel")}>
            Select Level
          </Button>
          <Button variant={"gradientTransparent"} fontSize={"xx-large"} width={"210px"} height={"80px"} onClick={() => navigate("settings")}>
            Settings
          </Button>
          <Button variant={"gradientTransparent"} fontSize={"xx-large"} width={"210px"} height={"80px"} onClick={() => {sendMessageToUnity({type: "KILL_GAME"}); console.log("WEB CLICKED"); changeVantaColor("0000ff")}}>
            Exit
          </Button>
        </VStack>
      </Center>
  }


  return (<Box h={"100vh"} w={"100vw"} ref={backgroundRef}>
    
    <Box zIndex={1} height={"full"} width={"full"}>
        {rederNormalMainPage()}
    </Box>
    
    </Box>
  )
};

export default MainPage;