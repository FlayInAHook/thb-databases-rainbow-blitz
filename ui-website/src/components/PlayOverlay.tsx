import { Box, BoxProps, Center, Icon, IconProps } from "@chakra-ui/react";
import { CiPlay1 } from 'react-icons/ci';

type PlayOverlayProps = {
  visible?: boolean;
  fontSize: IconProps["fontSize"];
  alpha?: number;
  borderRadius?: BoxProps["borderRadius"];
}

const PlayOverlay = ({visible = true, fontSize, alpha = 0.6, borderRadius}: PlayOverlayProps) => {

  if (!visible) return <></>;

  return (
    <Box position={"absolute"} height={"full"} width={"full"} top={0} left={0} backgroundColor={`rgba(0,0,0,${alpha})`} borderRadius={borderRadius} pointerEvents={"none"}>
                          <Center height={"full"} width={"full"} pointerEvents={"none"}>
                            <Icon as={CiPlay1} fontSize={fontSize} color={"white"} pointerEvents={"none"} />
                          </Center>
                        </Box>
  )

}

export default PlayOverlay;