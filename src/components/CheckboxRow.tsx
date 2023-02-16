import { Box, Button, Center, Flex, Input, Text, useToast, Select, Checkbox, Wrap } from '@chakra-ui/react'

const CheckboxRow = ({ column, ...rest }) => {
  return (
    <Flex p='10px'>
      <Checkbox {...column.getToggleHiddenProps()} defaultChecked />
      <p>{column.Header}</p>
    </Flex>
  )
}
export default CheckboxRow
