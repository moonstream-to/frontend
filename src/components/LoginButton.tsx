import React, { useState } from "react"
import { Button, Text } from "@chakra-ui/react"
import SignIn from "./SignIn"
import useUser from "../contexts/UserContext"
import useLogout from "../hooks/useLogout"

const LoginButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useUser()

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const { logout } = useLogout()
  return (
    <>
      {!user && (
        <Button colorScheme="blue" onClick={handleOpen}>
          Login
        </Button>
      )}
      {user && <Text>{user.username}</Text>}
      {user && (
        <Button bg="transparent" onClick={() => logout()}>
          logout
        </Button>
      )}
      <SignIn isOpen={isOpen} onClose={handleClose} />
    </>
  )
}

export default LoginButton
