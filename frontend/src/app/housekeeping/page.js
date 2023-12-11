"use client"
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Navbar from "@/components/navbar/Navbar";
import { gql, useQuery } from "@apollo/client";
import {Text, Table, TableData, TextInput, Button, Space, Center, LoadingOverlay} from "@mantine/core"

import styles from "@/app/housekeeping/page.module.css";



const elements2 = [
  { place: "UC Cafeteria", lunch: 120, tea: 50 },
  { place: "Hostel", lunch: 50, tea: 120 },
  { place: "UC Cafeteria", lunch: 120, tea: 50 },
  { place: "Hostel", lunch: 50, tea: 120 },
];

const BOOKINGDETAILS = gql`
  query RoomBookingDetails {
    roomBookingDetails {
      bedSheetChange
      roomNo
      studentId
      time
    }
  }
`;
  

export default function Home() {
  const router = useRouter();
  const [bookingDetails, setBookingDetails] = useState([]);
  const check = typeof window !== "undefined" && window.localStorage;
  const token = check ? localStorage.getItem("token") : "";

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

  const { loading, error, data } = useQuery(BOOKINGDETAILS,{
    context: {
      headers: {
        authorization: token || "",
      },
    }
  });
  useEffect(() => {
    if(data){
      console.log(data);
      setBookingDetails(data.roomBookingDetails);
    }
  }, [data]);


  const rows = bookingDetails.map((booking, index) => (
    <Table.Tr key={index}>
      <Table.Td><Center>
          <div>{booking.time}</div>
        </Center></Table.Td>
      <Table.Td><Center>
          <div>{booking.roomNo}</div>
        </Center></Table.Td>
        
      <Table.Td><Center>
          <div>{booking.bedSheetChange?"Yes":"No"}</div>
        </Center></Table.Td>
        <Table.Td><Center>
          <div>{booking.studentId}</div>
        </Center></Table.Td>
      
      
    </Table.Tr>
  ));
    return (
      <main>
        <div className={styles.mainContainer}>
            <Navbar userT="housekeeping"/>

            <div className={styles.content}>
              <div className={styles.mContainer}>
                <div className={styles.heading}>
                  <Text ta="center" className={styles.headingText}>
                    House Keeping
                  </Text>
                </div>
                <div className={styles.subContainer}>
                  <div className={styles.table}>
                   <Table stickyHeader stickyHeaderOffset={0} horizontalSpacing="xl" highlightOnHover withTableBorder withColumnBorders>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th ta="center">Time</Table.Th>
                          <Table.Th ta="center">Room No</Table.Th>
                          <Table.Th ta="center">Bed Sheet Change</Table.Th>
                          <Table.Th ta="center">Student ID</Table.Th>
                          
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>{rows}</Table.Tbody>
                    </Table> 
                    </div>
                  </div>
                </div>
              
            </div>    
        </div> 
      </main>
    )
  }