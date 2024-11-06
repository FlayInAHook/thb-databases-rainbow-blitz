import { Box, Grid, GridItem, Heading, HStack, Text } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestUniqueID, UnityMessage } from "./Datastorage";
import { CHAPTERS, formatMilliseconds, getFontSizeByRank, LeaderboardTime, Level } from "./SelectLevel";
import Medal, { MedalProps } from "./components/Medal";

export function getFormattedTime(elapsedTime: number) {
  const minutes = Math.floor(elapsedTime / 60000).toString().padStart(2, '0');
  const seconds = Math.floor((elapsedTime % 60000) / 1000).toString().padStart(2, '0');
  const milliseconds = Math.floor(elapsedTime % 1000).toString().padStart(3, '0');

  return `${minutes}:${seconds}:${milliseconds}`;
}

const IngameOverlay: React.FC = () => {

  const [time, setTime] = useState<number>(0);
  const [levelID, setLevelID] = useState<number>(0);
  const [level, setLevel] = useState<Level>();
  const [oldTime, setOldTime] = useState<number>(0);
  const [restart, setRestart] = useState<boolean>(false);

  useEffect(() => {
    if (!window.vuplex) {
      console.error("Too bad! This is not a Vuplex Webview!");
      return;
    }
    window.vuplex.addEventListener("message", handleUnityMessage);
    return () => window.removeEventListener("message", handleUnityMessage);
  }, []);

  const [uniqueID, setUniqueID] = useState<string>("");
  useEffect(() => {
    if (!window.vuplex) {
      console.error("Too bad! This is not a Vuplex Webview!");
      setUniqueID("NO_VUPLEX");
      return;
    }

    console.log("Requesting Unique ID");
    setTimeout(() => {
      requestUniqueID();
    }, 500);
    //requestUniqueID();
    window.vuplex?.addEventListener("message", handleUnityMessage);
    return () => window.vuplex?.removeEventListener("message", handleUnityMessage);
  }, []);


  const navigate = useNavigate();


  useEffect(() => {
    if (!levelID) return;
    const level = CHAPTERS.find((chapter) => chapter.level.find((level) => level.id == levelID))?.level.find((level) => level.id == levelID);
    console.log("Level", level, levelID, CHAPTERS);
    if (!level) return;
    setLevel(level);
  }, [levelID]);

  function handleUnityMessage(_event: any) {
    console.log("Unity Message", _event);
    //console.log("Unity Message", _event);
    const event = JSON.parse(_event.data) as UnityMessage;
    if (event.type === "FINISHED_LEVEL") {
      console.log("Finished Level", event);
      setTime(event.data.time);
      setLevelID(event.data.levelID);
      setOldTime(0); // get users highscore 
      //console.log(event.data.time, event.data.levelID, user);
      setRestart(false);
      // update leaderboard etc
    }
    if (event.type === "LEVEL_ID") {
      setLevelID(event.data.levelID);
      setOldTime(0);
    }
    if (event.type === "RESTART_LEVEL") {
      console.log("Restart Level", event);
      setRestart(true);
    }
    if (event.type == "UNIQUE_ID"){
      setUniqueID(event.data);
      console.log("got Unique ID", event.data);
    }
    if (event.type == "OPEN_ESCAPE_MENU"){
      console.log("Open Escape Menu", event);
      navigate("/escapeoverlay");
    }
  }

  function renderTime(){

    if (time != 0 && time < oldTime) {
      return (
        <Box position={"absolute"} left={"100px"} top={"100px"}>
          <Heading fontSize={"4xl"}>Level Complete</Heading>
          { time != 0 && <Heading fontSize={"2xl"} variant={"gradient"}>{getFormattedTime(time)}</Heading>}
          <Heading fontSize={"2xl"} variant={"gradient"}>New Best!</Heading>
        </Box>
      );
    }
    
    return (
      <Box position={"absolute"} left={"100px"} top={"100px"}>
        { time != 0 && <Heading fontSize={"2xl"} color="red.300" >{getFormattedTime(time)}</Heading>}
        <Heading fontSize={"2xl"} color="gray">{getFormattedTime(oldTime)}</Heading>
      </Box>
    );
  }

  function renderMedals(){
    if (!level) return;
    const renderedMedals = Object.keys((level.targetTimeInMS ?? {})).map((key) => {
      const targetTime = level.targetTimeInMS![key as keyof typeof level.targetTimeInMS];
      const timeInMS = time > oldTime ? oldTime : time;
      const medal = timeInMS <= targetTime ? key as MedalProps["type"] : "dotted" as MedalProps["type"];
      return <Medal key={key} type={medal} number={undefined} />
    });
    return (
      <Box position={"absolute"} left={"100px"} top={"200px"}>
        <HStack spacing={0}>
          {renderedMedals}
        </HStack>
      </Box>
    )
  }

  const [leaderboards, setLeaderboards] = useState<Record<string,LeaderboardTime[]>>({"1": [{username: "USER", timeInMS: 1234}, {username: "USER2", timeInMS: 2234}, {username: "USER3", timeInMS: 3234}]});

  function renderLeaderBoards(){
    return (
      <Box position={"absolute"} left={"100px"} top={"300px"}>      
        <Heading variant={"gradient"} size={"2xl"} width={"full"} textAlign={"center"}>Leaderboard</Heading>  
        {leaderboards[levelID]?.slice(0, 5).map((time, i) => {
          return <Grid
            templateColumns="20px 1fr 150px" // Adjust the widths as needed
            gap={2}
            key={time.username + i}
            alignItems="center"
          >
            <GridItem>
              <Text fontSize={getFontSizeByRank(i)}>{i + 1}</Text>
            </GridItem>
            <GridItem>
              <Text fontSize={getFontSizeByRank(i)} color={time.username == "USER" ? "gold" : ""} >{time.username}</Text>
            </GridItem>
            <GridItem>
              <Text fontSize={getFontSizeByRank(i)}>{formatMilliseconds(time.timeInMS)}</Text>
            </GridItem>
          </Grid>

        })}
      </Box>
    )
  }


  return (<>
    <style>
      {`body {
        background: rgba(0, 0, 0, 0) !important;
      }
      `}
    </style>
    <Box h={"100vh"} w={"100vw"} >
      <HStack h="full" w={"full"} spacing={0}>
        <Box h="full" w={"50%"} background={"rgba(31, 31, 31, 1)"} position={"relative"} >
          {renderTime()}
          {renderMedals()}
          {renderLeaderBoards()}
          <Box position={"absolute"} left={"100px"} bottom={"100px"}>
            <Heading as={"h1"} fontSize={"4xl"}>Press space to continue</Heading>
          </Box>
        </Box>
        <Box h="full" w={"50%"}  background={"rgba(31, 31, 31, 0.8)"}>

        </Box>
      </HStack>
    </Box>
  </>);
};  

export default IngameOverlay;