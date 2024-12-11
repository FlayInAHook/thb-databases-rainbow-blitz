import { Box, Button, Center, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack, Tooltip, VStack } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customColorModeAtom, fetchUser, requestUniqueID, UnityMessage, userAtom } from './Datastorage';


function sendMessageToUnity(message: object) {
  if (!window.vuplex) return console.error("No Vuplex Webview found!");
  window.vuplex.postMessage(message);
}

export const sensitivityAtom = atomWithStorage("sensitivity", 1);

const SettingsPage: React.FC = () => {
  const [vantaEffect, setVantaEffect] = useState<any>(null)
  const [customColorMode] = useAtom(customColorModeAtom);
  
 
  const backgroundRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [uniqueID, setUniqueID] = useState<string>("");
  const [user, setUser] = useAtom(userAtom)
  const [userWasFetched, setUserWasFetched] = useState<boolean>(false);

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


  useEffect(() => {
    if (!backgroundRef.current) return;
    if (vantaEffect) return;
      //setVantaEffect(CLOUDS({...vantaConfig, el: backgroundRef.current}));
  }, [backgroundRef]);

  useEffect(() => {
    if (!uniqueID) return;
    fetchUser(uniqueID).then((user) => {
      setUser(Object.keys(user).length === 0 ? null : user);
      setUserWasFetched(true);
    });
  }, [uniqueID]);



  function handleUnityMessage(_event: any) {
    //console.log("Unity Message", _event);
    const event = JSON.parse(_event.data) as UnityMessage;
    if (event.type == "UNIQUE_ID"){
      setUniqueID(event.data);
    }
  }

  const [showTooltip, setShowTooltip] = React.useState(false)
  const [sensitivity, setSensitivity] = useAtom(sensitivityAtom)

  useEffect(() => {
    sendMessageToUnity({type: "SENSITIVITY", content: sensitivity});
  }, [sensitivity]);


  return (<Box h={"100vh"} w={"100vw"} ref={backgroundRef}>
    
    <Box zIndex={1} height={"full"} width={"full"}>
        <Center height={"full"}>
          <VStack>
            <Box width={"10vw"}>
              <Slider
                id='slider'
                value={sensitivity * 100.0}
                min={0}
                max={200}
                colorScheme='teal'
                onChange={(v) => setSensitivity(v / 100.0)}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <SliderMark value={0} mt='1' ml='-4px' fontSize='sm'>
                  0
                </SliderMark>
                <SliderMark value={100} mt='1' ml='-4px' fontSize='sm'>
                  1
                </SliderMark>
                <SliderMark value={200} mt='1' ml='-4px' fontSize='sm'>
                  2
                </SliderMark>
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <Tooltip
                  hasArrow
                  bg='teal.500'
                  color='white'
                  placement='top'
                  isOpen={showTooltip}
                  label={`${sensitivity}`}
                >
                  <SliderThumb />
                </Tooltip>
              </Slider>
            </Box>
          
            <Button mt={5} onClick={() => navigate("/")} variant={"gradientTransparent"}>Save</Button> 
          </VStack>
          
        </Center>
    </Box>
    
    </Box>
  )
};

export default SettingsPage;