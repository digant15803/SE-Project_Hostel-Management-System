"use client"
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Title,
  Radio,
  Text,
  TextInput,
  Button,
  LoadingOverlay,
} from "@mantine/core";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "@mantine/form";

import Google from "@/assets/general/Google.svg";

import styles from "./AuthComp.module.css";
import Image from "next/image";
// import {
//   showSuccessNotification,
//   showErrorNotification,
// } from "@/utils/notifications.helper";

import { createHmac } from "crypto";
const secret = 'abcdefg';

const Login = gql(`
    mutation Login($loginInput: loginInput) {
      login(loginInput: $loginInput) {
        id
        name
        position
        roomNo
        username
      }
    }
  `);

const ChangePwd = gql(`
  mutation ChangePwd($changePwd: changePwd) {
    changePwd(changePwd: $changePwd) {
      id
      name
      position
      roomNo
      username
    }
  }
`);

function AuthComp() {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: ""
    },

    validate: {
      username: (value) => value.trim().length > 0,
      password: (value) => value.trim().length > 0,
      confirmPassword: (value) => value===form.values.password,
    },
  });

  const [login] = useMutation(Login);
  const [changepwd] = useMutation(ChangePwd);
  const [createPassword, setCreatePassword] = useState(false);

  const eventLogin = async () => {
    if(createPassword===true){
      try {
        const {data} = await changepwd({
          variables: { "changePwd": {
            "username": form.values.username,
            "password": JSON.stringify(createHmac('sha256', secret).update(form.values.password).digest('hex')).slice(1,-1)
          }},
        });
        console.log("PASSWORD CREATED -- SUCCESS", data);
        // showSuccessNotification(
        //   "User Created",
        //   "Password should be created by user."
        // );
        if(data.changePwd.username!=null){
          setCreatePassword(false);
        }
      } catch (error) {
        console.log("PASSWORD CREATION -- ERROR", error);
        // showErrorNotification("Failed to create user", error?.message);
      }
    }
    else{
      console.log(form.values);
      try {
        const {data} = await login({
          variables: { "loginInput": {
            "username": form.values.username,
            "password": JSON.stringify(createHmac('sha256', secret).update(form.values.password).digest('hex')).slice(1,-1)
          }},
        });
        console.log("AUTHENTICATE -- SUCCESS", data);
        // showSuccessNotification(
        //   "User Created",
        //   "Password should be created by user."
        // );
        if(data.login.username==null){
          setCreatePassword(true);
        }
        else{
          router.push("\student");
        }
      } catch (error) {
        console.log("AUTHENTICATE -- ERROR", error);
        // showErrorNotification("Failed to create user", error?.message);
      }
    }
  };

  return (
    <div className={styles.container}>
      <LoadingOverlay
        loaderProps={{
          variant: "bars",
        }}
        // visible={isMutating}
        // overlayBlur={2}
      />
      {createPassword ? 
        <Title order={4}>
          Create Password
        </Title> : 
        <Title order={4}>
          Login
        </Title>
      }
      <div className={styles.form}>
        <div className={styles.methodSelections}>
          <div className={styles.methodContainer}>
              <div className={styles.inputs}>
                <TextInput
                  placeholder="Username"
                  {...form.getInputProps("username")}
                  classNames={{
                    input: styles.defaultRadius,
                  }}
                  size="md"
                />
                <TextInput
                  placeholder="Password"
                  {...form.getInputProps("password")}
                  classNames={{
                    input: styles.defaultRadius,
                  }}
                  size="md"
                />
                {createPassword ? <TextInput
                  placeholder="Confirm Password"
                  {...form.getInputProps("confirmPassword")}
                  classNames={{
                    input: styles.defaultRadius,
                  }}
                  size="md"
                /> : ""}
              </div>
            <Button
              fullWidth
              // rightIcon={<Image src={FlowIcon} alt="Flow Icon" />}
              size="md"
              classNames={{
                root: styles.defaultRadius,
              }}
              onClick={eventLogin}
            >
              Login
            </Button>
          </div>
          <div className={styles.methodContainer}>
            <Text ta="center">
              or
            </Text>
            <Button
              disabled
              fullWidth
              // rightIcon={<Image src={GoogleIcon} alt="Google Icon" />}
              size="md"
              classNames={{
                root: styles.defaultRadius,
              }}
              variant="outline"
            >
              <Image src={Google} alt="Google"/> &nbsp; Continue with Google 
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthComp;