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


import Google from "@/assets/general/Google.svg";

import styles from "./RegComp.module.css";
import Image from "next/image";
// import useSWRMutation from "swr/mutation";

// import { authenticationFetcher } from "@/hooks/auth.swr";
// import {
//   showSuccessNotification,
//   showErrorNotification,
// } from "@/utils/notifications.helper";
// import SWR_CONSTANTS from "@/utils/swrConstants";
// import { mutate } from "swr";

function RegComp() {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
      userType: "user",
    },

    validate: {
      username: (value: string) => value.trim().length > 0,
      password: (value: string) => value.trim().length > 0,
    },
  });

  const [user, setUser] = useState<string>("");

//   const { trigger: authenticate, isMutating } = useSWRMutation(
//     SWR_CONSTANTS.AUTHENTICATE_USER,
//     authenticationFetcher
//   );

//   const authenticateUser = async () => {
//     try {
//       const data = await authenticate({
//         authType: type,
//         data: form.values,
//       });
//       console.log("AUTHENTICATE -- SUCCESS", data);
//       const userData = await mutate(SWR_CONSTANTS.GET_USER);
//       console.log("AUTHENTICATE -- USER", userData);
//       if (!userData || !userData.id) {
//         return showErrorNotification("Failed to Login", "User not found");
//       }
//       router.push(userData.type === "1" ? "/artist" : "/player");
//       showSuccessNotification(
//         "Login Success",
//         "You Have logged in Successfully, Continue to explore MeloMint"
//       );
//     } catch (error: any) {
//       console.log("AUTHENTICATE -- ERROR", error);
//       showErrorNotification("Failed to Login", error?.message);
//     }
//   };

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div className={styles.container}>
      <LoadingOverlay
        loaderProps={{
          variant: "bars",
        }}
        // visible={isMutating}
        // overlayBlur={2}
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
                <TextInput
                  placeholder="Password"
                  {...form.getInputProps("password")}
                  classNames={{
                    input: styles.defaultRadius,
                  }}
                  size="md"
                />
                <Select
                  placeholder="Position"
                  classNames={{
                    input: styles.defaultRadius,
                  }}
                  data={['Mess', 'Student', 'House keeping']}
                  size="md"
                />
                <TextInput 
                  placeholder="Id"
                  {...form.getInputProps("Id")}
                  classNames={{
                    input: styles.defaultRadius,
                  }}
                  size="md"
                />
              </div>
            <Button
              fullWidth
              // rightIcon={<Image src={FlowIcon} alt="Flow Icon" />}
              size="md"
              classNames={{
                root: styles.defaultRadius,
              }}
              // onClick={authenticateUser}
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