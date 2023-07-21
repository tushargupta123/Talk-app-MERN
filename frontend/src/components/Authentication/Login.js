import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from "axios";
import {useNavigate} from "react-router-dom"

const Login = () => {

  const [email,setEmail] = useState();
  const [password,setPassword] = useState();
  const [show,setShow] = useState(false);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();

  const toast = useToast();

  const submitHandler = async() => {
    setLoading(true);
    if(!email || !password){
      toast({
        title:"Please fill all the fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: 'bottom'
      })
      setLoading(false);
    }else{
      try{
        const config = {
          headers: {
            "Content-Type": "application/json",
          }
        }
        const {data} = await axios.post('http://localhost:5000/api/user/login',{
          email,password
        },config);
        toast({
          title:"Logged in successful",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: 'bottom'
        })
        localStorage.setItem('userInfo',JSON.stringify(data));
        setLoading(false);
        navigate('/chats')
      }catch(e){
        toast({
          title:"Error occured!",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: 'bottom'
        })
        setLoading(false);
      }
    }
  }

  return (
    <VStack spacing="5px" color='black'>
      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
          <Input placeholder='Enter your Email'
          onChange={(e) => setEmail(e.target.value)}/>
      </FormControl>
      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input type={show ? "text":"password"} placeholder='Enter your Password'
          onChange={(e) => setPassword(e.target.value)}/>
          <InputRightElement width="4.5rem">
            <Button onClick={() => setShow(!show)} h="1.75rem" size="sm">{show ? "Hide":"Show"}</Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button colorScheme='blue' isLoading={loading} width="100%" style={{marginTop: 15}} onClick={submitHandler}>Log in</Button>
    </VStack>
  )
}

export default Login