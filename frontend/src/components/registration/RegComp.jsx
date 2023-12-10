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
  Select
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { gql, useMutation } from "@apollo/client";

import styles from "./RegComp.module.css";

import {
  showSuccessNotification,
  showErrorNotification,
} from "@/utils/notifications.helper";


const Signup = gql(`
    mutation Signup($signupInput: signupInput) { 
      signup(signupInput: $signupInput) {
        id 
        name
        username
      }
    }
  `);

function RegComp() {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      username: "",
      id: "",
      name: "",
      position: "",
    },

    validate: {
      username: (value) => value.trim().length > 0,
      id: (value) => value.trim().length > 0,
      name: (value) => value.trim().length > 0,
      position: (value) => value.trim().length > 0,
    },
  });
  const [signup] = useMutation(Signup);

  const createUser = async () => {
    try {
      const {loading, data} = await signup({
        variables: { "signupInput": {
          "id": form.values.id,
          "name": form.values.name,
          "position": form.values.position,
          "username": form.values.username
        }},
      });
      console.log("AUTHENTICATE -- SUCCESS", data);
      showSuccessNotification(
        "User Created",
        "Password should be created by user."
      );
    } catch (error) {
      console.log("AUTHENTICATE -- ERROR", error);
      showErrorNotification("Failed to create user", error?.message);
    }
    form.reset();
  };

  return (
    <div className={styles.container}>
      <LoadingOverlay
        loaderProps={{
          variant: "bars",
        }}
        visible={signup.loading}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <Title order={4}>
        Create Account
      </Title>
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
                {/* <TextInput
                  placeholder="Password"
                  {...form.getInputProps("password")}
                  classNames={{
                    input: styles.defaultRadius,
                  }}
                  size="md"
                /> */}
                <Select
                  placeholder="Position"
                  {...form.getInputProps("position")}
                  classNames={{
                    input: styles.defaultRadius,
                  }}
                  data={['Mess', 'Student', 'House keeping']}
                  size="md"
                />
                <TextInput 
                  placeholder="Id"
                  {...form.getInputProps("id")}
                  classNames={{
                    input: styles.defaultRadius,
                  }}
                  size="md"
                />
                <TextInput 
                  placeholder="Name"
                  {...form.getInputProps("name")}
                  classNames={{
                    input: styles.defaultRadius,
                  }}
                  size="md"
                />
              </div>
            <Button
              fullWidth
              size="md"
              classNames={{
                root: styles.defaultRadius,
              }}
              onClick={createUser}
            >
              Create Account
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default RegComp;