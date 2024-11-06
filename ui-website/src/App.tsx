import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./ApexChartsCustom.css";
import EscapeOverlay from './EscapeOverlay';
import IngameOverlay from './IngameOverlay';
import MainPage from './MainPage';
import SelectLevel from './SelectLevel';
import SettingsPage from './SettingsPage';
import customTheme from './Theme';

//import "./text.css"

function App() {

  return (
    <>
      <ChakraProvider theme={customTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage/>} />
          <Route path="*" element={<MainPage/>} />
          <Route path="selectlevel" element={<SelectLevel/>} />
          <Route path="ingameoverlay" element={<IngameOverlay/> } />
          <Route path="escapeoverlay" element={<EscapeOverlay/>} />
          <Route path="settings" element={<SettingsPage/>} />
        </Routes>
      </BrowserRouter>
      </ChakraProvider>
    </>
  )
}

export default App
