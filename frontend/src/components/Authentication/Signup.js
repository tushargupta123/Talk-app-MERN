import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom"

const Signup = () => {

  const [name,setName] = useState();
  const [email,setEmail] = useState();
  const [password,setPassword] = useState();
  const [confirmPassword,setConfirmPassword] = useState();
  const [pic,setPic] = useState();
  const [show,setShow] = useState(false);
  const [loading,setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const postDetails = (pics) => {
    setLoading(true);
    if(pics==undefined){
      toast({
        title:"Please select an image",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: 'bottom'
      })
      setLoading(false);
      return;
    }
      const data = new FormData();
      data.append('file',pics);
      data.append('upload_preset','talk-a-tive');
      data.append('cloud_name','dul2ilxbc')
      fetch("https://api.cloudinary.com/v1_1/dul2ilxbc/image/upload",{
        method: 'POST',
        body:data
      }).then(res => res.json())
      .then(data => {
        setPic(data.url.toString());
        setLoading(false);
      }).catch(err => {
        console.log(err)
        setLoading(false);
      })
  }

  const submitHandler = async() => {
    setLoading(true);
    if(!name || !email || !password || !confirmPassword){
      toast({
        title:"Please fill all the fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: 'bottom'
      })
      setLoading(false);
    }else if(password!==confirmPassword){
      toast({
        title:"Password and confirm password does not matched",
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
        const {data} = await axios.post('https://talk-app-backend.vercel.app/api/user/signup',{
          name,email,password,pic
        },config);
        toast({
          title:"Registration successful",
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
      <FormControl id='first-name' isRequired>
        <FormLabel>Name</FormLabel>
          <Input placeholder='Enter your Name'
          onChange={(e) => setName(e.target.value)}/>
      </FormControl>
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
      <FormControl id='confirm-password' isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input type={show ? "text":"password"} placeholder='Enter your Confirm Password'
          onChange={(e) => setConfirmPassword(e.target.value)}/>
          <InputRightElement width="4.5rem">
            <Button onClick={() => setShow(!show)} h="1.75rem" size="sm">{show ? "Hide":"Show"}</Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id='pic'>
        <FormLabel>Uplaod your picture</FormLabel>
          <Input type={"file"} p={1.5} accept='image/*'
          onChange={(e) => postDetails(e.target.files[0])}/>
      </FormControl>
      <Button colorScheme='blue' width="100%" style={{marginTop: 15}} onClick={submitHandler} isLoading={loading}>Sign Up</Button>
    </VStack>
  )
}

export default Signup