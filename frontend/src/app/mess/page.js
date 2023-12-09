"use client"
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Navbar from "@/components/navbar/Navbar"
import {Text, Table, TableData, TextInput, Button} from "@mantine/core"
import { gql, useQuery } from "@apollo/client";
import styles from "@/app/mess/page.module.css"
import { useState, useEffect } from "react";


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

const elements = [
  { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
  { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
  { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
  { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
  { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
];



export default function Home() {
  const router = useRouter();

  const [token, setToken] = useState(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem("token");
      if (storedToken != null) {
        setToken(storedToken);
      }
    }
  }, []);


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

  const rows = elements.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td>{element.position}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.symbol}</Table.Td>
      <Table.Td>{element.mass}</Table.Td>
    </Table.Tr>
  ));

  
  
  const { loading, error, data } = useQuery(PLACECOUNTDETAILS)
  const [placeCount, setplaceCount] = useState([])
  useEffect(() => {
    if (data) {
      setplaceCount(data.placecount);
    }
  }, [data]);

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


    return (
      <main>
        <div className={styles.mainContainer}>
            <Navbar userT="mess"/>

            <div className={styles.content}>
              <div className={styles.leftContainer}>
                <div className={styles.heading}>
                  <Text ta="center" className={styles.headingText}>
                    House Keeping
                  </Text>
                </div>
                <div className={styles.headingContent}>
                  <div className={styles.table}>
                    <Table stickyHeader stickyHeaderOffset={0} horizontalSpacing="xl" highlightOnHover withTableBorder withColumnBorders>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Element position</Table.Th>
                          <Table.Th>Element name</Table.Th>
                          <Table.Th>Symbol</Table.Th>
                          <Table.Th>Atomic mass</Table.Th>
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
                    >
                      Mark
                    </Button>
                  </div>
                </div>
              </div>
            </div>
        </div>
        
      </main>
    )
  }