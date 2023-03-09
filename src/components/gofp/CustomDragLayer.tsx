import { Box, Flex, Text } from "@chakra-ui/react";
import { CSSProperties } from "react";
import { useDragLayer, XYCoord } from "react-dnd";
import useGofp from "../../contexts/GoFPContext";

export const CustomDragLayer = () => {
  const {
    item,
    isDragging,
    initialCursorOffset,
    initialOffset,
    currentOffset,
  } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialCursorOffset: monitor.getInitialClientOffset(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  const {selectedTokens} = useGofp()

  if (!isDragging) {
    return null;
  }

  return (
    <Box style={layerStyles}>
      <Box
        style={getItemStyles(
          initialCursorOffset,
          initialOffset,
          currentOffset
        )}
        cursor='pointer'
      >
        <Flex
          backgroundColor='#353535'
          flexDirection="column"
          gap='5px'
          w="60px"
          h="83px"
          mx={1}
          rounded="lg"
          borderWidth="1px"
          borderColor="#FFFFFF"
          borderRadius="10px"
          alignItems="center"
          textAlign="center"
          zIndex='100'
          position='absolute'
        >
          <Box
            w="40px"
            h="40px"
            borderWidth="1px"
            borderColor="#FFFFFF"
            borderRadius="50%"
            mt="5px"
            backgroundImage={item.image}
            backgroundPosition="center"
            backgroundSize="contain"
          />
          <Text fontSize='8px'>{item.name}</Text>
        </Flex>
        {selectedTokens.slice(1).map((_: any, idx: number) => (<Flex 
          w='60px' 
          h='83px' 
          position='absolute'           
          backgroundColor='#353535'
          flexDirection="column"
          key={idx}
          mx={1}
          rounded="lg"
          borderWidth="1px"
          borderColor="#FFFFFF"
          borderRadius="10px"
          alignItems="center"
          textAlign="center"
          left='0'
          top='0'
          zIndex={`${90 - idx}`}
          transform={`rotate(-${7 * (idx + 1)}deg)`}
          />
        ))}
      </Box>
    </Box>
  );
};




const layerStyles: CSSProperties = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 100,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  cursor: 'move'
};

function getItemStyles(
  initialCursorOffset: XYCoord | null,
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null
) {
  if (!initialOffset || !currentOffset || !initialCursorOffset) {
    return {
      display: "none",
    };
  }

  const x = initialCursorOffset?.x + (currentOffset.x - initialOffset.x) - 20;
  const y = initialCursorOffset?.y + (currentOffset.y - initialOffset.y) - 50;
  const transform = `translate(${x}px, ${y}px)`;

  return {
    transform,
    WebkitTransform: transform,
    width: "50px",
    height: "50px",
    cursor: 'move'
  };
}
