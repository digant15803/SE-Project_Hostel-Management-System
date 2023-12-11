"use client"
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Navbar from "@/components/navbar/Navbar";
import {Text, Table, TextInput, Button, Space, Center, Modal, UnstyledButton, LoadingOverlay } from "@mantine/core";
import { IconTrash } from '@tabler/icons-react';
import { gql, useMutation, useQuery } from "@apollo/client";

import styles from "@/app/admin/page.module.css"
import { ReactElement } from "react";

import RegComp from "@/components/registration/RegComp";

const TIMESLOTDETAILS = gql`
  query timeSlotDetails {
    timeSlots {
      slotsAva
      time
    }
  }
`;

const PLACECOUNTDETAILS = gql`
  query Placecount {
    placecount {
      collegeLunchCount
      collegeTeaCount
      hostelMessLunchCount
      hostelMessTeaCount
    }
  }
`;

const MEALUPDATE = gql`
  mutation Mutation($mstudentId: mstudentId) {
    mealUpdate(mstudentId: $mstudentId) {
      already
      flag
    }
  }
`;








// const elements = [
//     [6, 12.011, ['C','N'], 'Carbon'],
//     [7, 12.011, ['C','N'], 'Carbon'],
//     [8, 12.011, ['C','N'], 'Carbon'],
//     [9, 12.011, ['C','N'], 'Carbon'],
//     [10, 12.011, ['C','N'], 'Carbon'],
//     [11, 12.011, ['C','N'], 'Carbon'],
//     [12, 12.011, ['C','N'], 'Carbon'],
//     [13, 12.011, ['C','N'], 'Carbon'],
//     [14, 12.011, ['C','N'], 'Carbon'],
//     [15, 12.011, ['C','N'], 'Carbon'],
//     [16, 12.011, ['C','N'], 'Carbon'],
//     [17, 12.011, ['C','N'], 'Carbon'],
//     // [7, 14.007, 'N', 'Nitrogen'],
//     // [39, 88.906, 'Y', 'Yttrium'],
//     // [56, 137.33, 'Ba', 'Barium'],
//     // [58, 140.12, 'Ce', 'Cerium'],
//   ];

// const elements = [
//   {time: "11:00", slotsAva: 3},
//   {time: "11:30", slotsAva: 3},
//   {time: "12:00", slotsAva: 3},
//   {time: "12:30", slotsAva: 3},
//   {time: "13:00", slotsAva: 3},
//   {time: "13:30", slotsAva: 3},
//   {time: "14:00", slotsAva: 3},
// ];




  

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // const [token, setToken] = useState("");
  const [elements, setElements] = useState();
  const [placeCount, setplaceCount] = useState([]);

  const [enrolmentNumber, setEnrolmentNumber] = useState("");

  const [loadingData, setLoadingData] = useState(false);
  const check = typeof window !== "undefined" && window.localStorage;
  const token = check ? localStorage.getItem("token") : "";

  const [mealupdate] = useMutation(MEALUPDATE);
  const markStudent = async () => {
    try {
      console.log(token);
      const { M_data } = await mealupdate({
        variables: {
          "mstudentId": {
            "studentId": enrolmentNumber
          }
        },
        context: {
          headers: {
            authorization: token || "",
          },
        },
      });
      // console.log(M_data.mealupdate);
    } catch (error) {
      console.error("Error marking student:", error);
    }
  };

  useEffect(() => {
    if (token !== null) {
      try {
        const info = jwtDecode(token);
        if (info.position === "Student") {
          router.push("/student");
        } else if (info.position === "Mess") {
          router.push("/mess");
        } else if (info.position === "House keeping") {
          router.push("/housekeeping");
        } else if (info.position === "admin") {
          router.push("/admin");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        // router.push("/");
      }
    }
  }, [token]);

  const { loading, error, data } = useQuery(TIMESLOTDETAILS,{
    context: {
      headers: {
        authorization: token || "",
      },
    }
  });


  
  useEffect(() => {
    if(data){
      console.log(data);
      setElements(data.timeSlots);
      setLoadingData(true);
    }
  }, [data]);





  
  const { loading: P_loading, error: P_error, data: P_data } = useQuery(PLACECOUNTDETAILS,{
    context: {
      headers: {
        authorization: token || "",
      },
    }
  });
  useEffect(() => {
    if(P_data){
      setplaceCount(P_data.placecount);
    }
  }, [P_data]);
  console.log(P_data);
  
  const closeRegModal = () => {
    router.push("/admin");
  };

    const elements2 = [
    {
      place: "UC Cafeteria",
      lunch: placeCount.collegeLunchCount,
      tea: placeCount.collegeTeaCount,
    },
    {
      place: "Hostel",
      lunch: placeCount.hostelMessLunchCount,
      tea: placeCount.hostelMessTeaCount,
    },
  ];
  const rows2 = elements2.map((element) => (
    <Table.Tr key={element.place}>
      <Table.Td>{element.place}</Table.Td>
      <Table.Td>{element.lunch}</Table.Td>
      <Table.Td>{element.tea}</Table.Td>
    </Table.Tr>
  ));

  let seasonsList = [];

  function roer(subR){
    seasonsList = []
    subR.forEach((season, index) => {
      seasonsList.push(<Center><div>{season}</div></Center>);
      if(index<subR.length-1){
        seasonsList.push(<Space h="sm" />);
      }
    });
  }
  function removeTime(time){
    console.log(time);
  }
  const rows = elements && elements.map((element) => (
    <Table.Tr key={element.time}>
      <Table.Td><Center><div>{element.time}</div></Center></Table.Td>
      <Table.Td><Center><div>{element.slotsAva}</div></Center></Table.Td>
      <Table.Td> <UnstyledButton  value={element.time} onClick={(event) => removeTime(event.currentTarget.value)}><IconTrash /></UnstyledButton ></Table.Td>
    </Table.Tr>
  ));
  
    return (
      <main>
        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 4 }} />
        {loadingData && <div className={styles.mainContainer}>
            <Navbar userT="admin"/>

            <div className={styles.content}>
              <div className={styles.leftContainer}>
                <div className={styles.heading}>
                  <Text ta="center" className={styles.headingText}>
                    House Keeping
                  </Text>
                </div>
                <div className={styles.headingContent}>
                  <div className={styles.table}>
                    {/* <Table stickyHeader stickyHeaderOffset={0} horizontalSpacing="xl" highlightOnHover withTableBorder withColumnBorders>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Element position</Table.Th>
                          <Table.Th>Element name</Table.Th>
                          <Table.Th>Symbol</Table.Th>
                          <Table.Th>Atomic mass</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>{rows}</Table.Tbody>
                    </Table> */}
                    <Table stickyHeader stickyHeaderOffset={0} horizontalSpacing="xl" highlightOnHover withTableBorder withColumnBorders>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Time</Table.Th>
                          <Table.Th>Slots Available</Table.Th>
                          <Table.Th></Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                  </div>
                </div>
              </div>
              <div className={styles.rightContainer}>
                <div className={styles.rightSubContainer1}>
                  <div className={styles.headingText2}>
                    <Text ta="center" className={styles.headingText}>
                      Place Count
                    </Text>
                  </div>
                  <div className={styles.messTable}>
                    <Table stickyHeader stickyHeaderOffset={0} horizontalSpacing="xl" highlightOnHover withTableBorder withColumnBorders>
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th></Table.Th>
                            <Table.Th>Lunch</Table.Th>
                            <Table.Th>Tea</Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows2}</Table.Tbody>
                      </Table>
                  </div>
                </div>
                <div className={styles.rightSubContainer2}>
                  <div className={styles.headingText3}>
                    <Text ta="center" className={styles.headingText}>
                      Mark Student
                    </Text>
                  </div>

                  <div className={styles.form}>
                    <TextInput
                      placeholder="Enrolment Number"
                      // {...form.getInputProps("username")}
                      value={enrolmentNumber}
                      onChange={(e) => setEnrolmentNumber(e.target.value)}
                      radius="xl"
                      size="md"
                      className={styles.inputText}
                    />

                    <Button
                      fullWidth
                      // rightIcon={<Image src={FlowIcon} alt="Flow Icon" />}
                      size="md"
                      classNames={{
                        root: styles.defaultRadius,
                      }}
                      // onClick={authenticateUser}
                      onClick={markStudent}
                    >
                      Mark
                    </Button>
                  </div>
                </div>
              </div>
            </div>
        </div>
        }

        <Modal
          opened={searchParams.get('authModal') === "registration"}
          onClose={closeRegModal}
          withCloseButton={false}
          size="md"
        >
          <RegComp/>
        </Modal>
      </main>
    )
  }