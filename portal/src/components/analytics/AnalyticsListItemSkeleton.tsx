import { Flex, Skeleton } from "@chakra-ui/react";

const SkeletonComponent = () => {
  return (
    <Flex
      flexDirection="column"
      gap="15px"
      p="10px"
      borderRadius="10px"
      border="1px solid #E6E6E6"
      cursor="pointer"
    >
      <Flex gap="10px" alignItems="center">
        <Skeleton
          startColor="#7d7d7d"
          endColor="#cccccc"
          height="20px"
          width="20px"
          borderRadius="full"
        />
        <Skeleton
          startColor="#7d7d7d"
          endColor="#cccccc"
          height="18px"
          width="100px"
          fadeDuration={1.5}
        />
      </Flex>
      <Flex gap="5px" wrap="wrap">
        {Array(Math.floor(Math.random() * 5) + 1)
          .fill(1)
          .map((_, idx) => (
            <Skeleton
              key={idx}
              startColor="#7d7d7d"
              endColor="#cccccc"
              height="12px"
              width="70px"
            />
          ))}
      </Flex>
    </Flex>
  );
};

export { SkeletonComponent };
