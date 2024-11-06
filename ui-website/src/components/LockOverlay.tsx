import { Box, BoxProps, Center, Icon, IconProps } from "@chakra-ui/react";
import { CiLock } from 'react-icons/ci';

type LockOverlayProps = {
  visible?: boolean;
  fontSize: IconProps["fontSize"];
  alpha?: number;
  borderRadius?: BoxProps["borderRadius"];
  paddingBottom?: BoxProps["paddingBottom"];
}

const LockOverlay = ({visible = true, fontSize, alpha = 0.8, borderRadius = "10px", paddingBottom = "unset"}: LockOverlayProps) => {
  
  if (!visible) return <></>;


  return (
    <Box position={"absolute"} height={"full"} width={"full"} top={0} left={0} backgroundColor={`rgba(0,0,0,${alpha})`} borderRadius={borderRadius}>
                          <Center height={"full"} width={"full"} paddingBottom={paddingBottom}>
                            <Icon as={CiLock} fontSize={fontSize} color={"white"} />
                          </Center>
                        </Box>
  )

}

export default LockOverlay;