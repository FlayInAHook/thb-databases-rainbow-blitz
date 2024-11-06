import { Box, BoxProps } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import "./Card.css";


interface CardProps extends BoxProps {
  innerpadding?: string;
}

const GradientCard: React.FC<CardProps> = (props) => {

  const cardRef = useRef<HTMLDivElement>(null);  // Reference to the container holding all cards

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const card = cardRef.current;
      if (!card) return;

      const blob = card.querySelector('.blob') as HTMLDivElement;
      const fakeBlob = card.querySelector('.fakeblob') as HTMLDivElement;
      if (blob && fakeBlob) {
        const rect = fakeBlob.getBoundingClientRect();
        requestAnimationFrame(() => {

          blob.style.opacity = '1';
          blob.animate([
            {
              transform: `translate(${(event.clientX - rect.left) - (rect.width / 2)}px, ${(event.clientY - rect.top) - (rect.height / 2)}px)`
            }
          ], {
            duration: 300,
            fill: 'forwards'
          });
        });
      }
    };

    // Attach event listener
    window.addEventListener('mousemove', handleMouseMove);

    // Clean up function
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);


  return <Box {...props} className="card" ref={cardRef} >
    <div className="inner" style={{padding: props.innerpadding}}>
      {props.children}
    </div>
    <div className="blob"/>
    <div className="fakeblob"/>
  </Box>;
}

export default GradientCard;