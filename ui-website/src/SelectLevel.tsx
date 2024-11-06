import { Box, Button, Center, Grid, GridItem, Heading, HStack, Text, VStack, Wrap } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GradientCard from './components/GradientCard';
import LockOverlay from './components/LockOverlay';
import PlayOverlay from './components/PlayOverlay';
import { requestUniqueID, UnityMessage } from './Datastorage';
import lvl1Image from '/level1.png';
import lvl2Image from '/level2.png';
import lvl3Image from '/level3.png';
import lvlDebugImage from '/levelDebug.png';

type ClassifyResult = {
  label: string;
  confidence: number;
}

export function sendMessageToUnity(message: object) {
  if (!window.vuplex) return console.error("No Vuplex Webview found!");
  window.vuplex.postMessage(message);
}

export type LeaderboardTime = {
  username: string;
  timeInMS: number;
}

export type Level = {
  title: string;
  image: string;
  times?: LeaderboardTime[];
  targetTimeInMS?: {
    author: number;
    gold: number;
    silver: number;
    bronze: number;
  },
  id: number;
}


type Chapter = {
  title: string;
  description: string;
  level: Level[];
}

export const CHAPTERS: Chapter[] = [
  {
    title: "Chapter 1",
    description: "This is the first chapter",
    level: [
      {
        title: "1 - Debug Level",
        image: lvlDebugImage,
        times: [
          {username: "Tim", timeInMS: 14321},
          {username: "Tom", timeInMS: 15298},
          {username: "Tina", timeInMS: 17075},
          {username: "Thorsten", timeInMS: 17354},
          {username: "Tobias", timeInMS: 17895},
          {username: "Tristan", timeInMS: 18514},
          {username: "Theo", timeInMS: 19234},
        ],
        targetTimeInMS:{
          author: 5300,
          gold: 7000,
          silver: 10000,
          bronze: 15000
        },
        id: 7777
      },
      {
        title: "2 - Level 1",
        image: lvl1Image,
        times: [
          {username: "Tim", timeInMS: 14321},
          {username: "Tom", timeInMS: 15298},
          {username: "Tina", timeInMS: 17075},
          {username: "Thorsten", timeInMS: 17354},
          {username: "Tobias", timeInMS: 17895},
          {username: "Tristan", timeInMS: 18514},
          {username: "Theo", timeInMS: 19234},
        ],
        targetTimeInMS:{
          author: 16184,
          gold: 18300,
          silver: 23000,
          bronze: 35000
        },
        id: 1
      },
      {
        title: "3 - Level 2",
        image: lvl2Image,
        times: [
          {username: "Tim", timeInMS: 14321},
          {username: "Tom", timeInMS: 15298},
          {username: "Tina", timeInMS: 17075},
          {username: "Thorsten", timeInMS: 17354},
          {username: "Tobias", timeInMS: 17895},
          {username: "Tristan", timeInMS: 18514},
          {username: "Theo", timeInMS: 19234},
        ],
        targetTimeInMS:{
          author: 6906,
          gold: 9500,
          silver: 15000,
          bronze: 25000
        },
        id: 2
      },
      {
        title: "4 - Name tdb.",
        image: lvl3Image,
        times: [
          {username: "Tim", timeInMS: 14321},
          {username: "Tom", timeInMS: 15298},
          {username: "Tina", timeInMS: 17075},
          {username: "Thorsten", timeInMS: 17354},
          {username: "Tobias", timeInMS: 17895},
          {username: "Tristan", timeInMS: 18514},
          {username: "Theo", timeInMS: 19234},
        ],
        targetTimeInMS:{
          author: 9499,
          gold: 12000,
          silver: 16000,
          bronze: 23000
        },
        id: 3
      },
      {
        title: "5 - Name tdb.",
        image: "https://placehold.co/600x500",
        id: 5
      },
      {
        title: "6 - Name tdb.",
        image: "https://placehold.co/600x500",
        id: 6
      },
      {
        title: "7 - Name tdb.",
        image: "https://placehold.co/600x500",
        id: 7
      },
      {
        title: "8 - Name tdb.",
        image: "https://placehold.co/600x500",
        id: 8
      },
      {
        title: "9 - Name tdb.",
        image: "https://placehold.co/600x500",
        id: 9
      },
      {
        title: "10 - Name tdb.",
        image: "https://placehold.co/600x500",
        id: 10
      }
    ]
  },
  {
    title: "Chapter 2",
    description: "This is to test the animation",
    level: [{
      title: "1 - Name tdb.",
      image: "https://placehold.co/600x500",
      id: 11
    }]
  },
  {
    title: "Chapter 3",
    description: "This is the third chapter",
    level: []
  },
  {
    title: "Chapter 4",
    description: "This is the fourth chapter",
    level: []
  },
  {
    title: "Chapter 5",
    description: "This is the fifth chapter",
    level: []
  },
  {
    title: "Chapter 6",
    description: "This is the sixth chapter",
    level: []
  }
]

const AnimatedWrap = motion(Wrap);
const AnimatedGradientCard = motion(GradientCard);

export function getFontSizeByRank(rank: number) {
  if (rank === 0) return "3xl";
  if (rank === 1) return "2xl";
  if (rank === 2) return "xl";
  return "lg";
}

export function formatMilliseconds(ms: number) {
  //minutes should be 2 digits
  const date = new Date(ms);
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const milliseconds = date.getMilliseconds().toString().padStart(3, "0");
  return `${minutes}:${seconds}.${milliseconds}`;
}

const SelectLevel: React.FC = () => {

  const [currentChapterIndex, setCurrentChapterIndex] = React.useState(0);
  const [currentLevelIndex, setCurrentLevelIndex] = React.useState(99);
  const [leaderboards, setLeaderboards] = React.useState<Record<string,LeaderboardTime[]>>({"1": [{username: "USER", timeInMS: 1234}, {username: "USER2", timeInMS: 2234}, {username: "USER3", timeInMS: 3234}]});

  

  

  function onChapterClick(chapterIndex: number) {
    if (CHAPTERS[chapterIndex].level.length === 0) return;
    setCurrentChapterIndex(chapterIndex);

  }

  function onLevelMouseEnter(levelIndex: number) {
    if (levelIndex >= 4) return;
    setCurrentLevelIndex(levelIndex);
  }

  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        navigate("/");
      }
    };  
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);


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

  


  function handleUnityMessage(_event: any) {
    //console.log("Unity Message", _event);
    const event = JSON.parse(_event.data) as UnityMessage;
    if (event.type == "UNIQUE_ID"){
      setUniqueID(event.data);
    }
  }
  

  
  return (<Box h={"100vh"} w={"100vw"} >
    
    <Box zIndex={1} height={"full"} width={"full"}>
      <Center position={"absolute"} width={"full"}><Heading variant={"gradient"} size='4xl' p={"5"} mb={"10%"} >Select Level</Heading></Center> 
      <Button variant={"gradientTransparent"} position={"absolute"} top={5} left={5} size={"md"} onClick={() => navigate("/")}>Back To Main Menu</Button>
      <HStack height={"full"} width={"full"}>
        <Box height={"80%"} width={"25%"}  mt={"3%"}>
          <Center height={"full"}>
            <VStack gap={8}>
            {CHAPTERS.map((chapter, i) => (
              <Button key={i} variant={"gradientTransparent"} fontSize={"xx-large"} width={"250px"} height={"90px"} onClick={() => onChapterClick(i)}>
                <VStack>
                <Text>{chapter.title}</Text>
                <Text fontSize={"small"}>{chapter.description}</Text>
                </VStack>
                <LockOverlay visible={chapter.level.length == 0} fontSize={"6xl"} borderRadius={"14px"} />
              </Button>
            ))} 
            </VStack>
          </Center>
        </Box>
        <HStack height={"full"} width={"75%"}>
          <Box height={"80%"} width={"70%"} overflow={"auto"} mt={"5%"}>
            <AnimatedWrap key={"abcd" + currentChapterIndex} spacing={"20px"} 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
            >
              {CHAPTERS[currentChapterIndex].level.map((level, i) => {
                return (
                  <motion.div
                    key={currentChapterIndex + "" + i}
                    variants={{
                      hidden: { opacity:0, x: -100},
                      visible: { opacity:1, x: 0},
                    }}
                  >
                    <GradientCard  h={"300px"} w={"300px"} innerpadding='15px' 
                    onMouseEnter={() => onLevelMouseEnter(i)} onMouseLeave={() => setCurrentLevelIndex(99)}>
                      <Box height={"220px"} width={"264px"} position={"relative"} onClick={() => sendMessageToUnity({type: "loadLevel", content: level.id})}>
                        <img src={level.image} alt={level.title}/>
                        <PlayOverlay visible={i === currentLevelIndex} fontSize={"9xl"} />
                      </Box>
                      
                      <Center textAlign={"center"} height={"23%"}>
                        <Heading fontSize={"x-large"}>{level.title}</Heading>
                        </Center>
                      <LockOverlay visible={i >= 4} fontSize={"9xl"} paddingBottom={"42px"} />
                    </GradientCard>
                  </motion.div>
                )
              })}
            </AnimatedWrap>
          </Box>
          <Box height={"80%"} width={"30%"} paddingX={"20px"} mt={"5%"} /*Leaderboard*/>
            <Center width={"full"}>
              <VStack width={"full"}>
                <Heading variant={"gradient"} size={"2xl"} width={"full"} textAlign={"center"}>Leaderboard</Heading>
                <Box width={"full"}>
                
                  {leaderboards[CHAPTERS[currentChapterIndex].level[currentLevelIndex]?.id.toString()]?.map((time, i) => {
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
                {currentLevelIndex < 99 &&
                <Box width={"full"} fontSize={"3xl"} borderTop={"1px solid white"} color="gold">
                  User -  : 00:00.000
                </Box>
                }
              </VStack>
            </Center>
          </Box>
          
          
          
        </HStack>
        
        
      </HStack>
      
    </Box>
    
    </Box>
  )

};

export default SelectLevel;