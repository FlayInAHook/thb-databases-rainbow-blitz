declare interface Window {
  vuplex: {
    addEventListener(event: string, callback: (event: any) => void): void;
    removeEventListener(event: string, callback: (event: any) => void): void;
    postMessage(message: Object): void;
  };
}

declare module 'vanta/dist/vanta.clouds.min' {
  const clouds: any;
  const fog: any;
  export default fog ;
}