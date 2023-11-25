"use client"

import Navbar from "@/components/navbar/Navbar"
import {Text, Table, TableData, TextInput, Button, Space, Center} from "@mantine/core"

import styles from "@/app/housekeeping/page.module.css"



const elements2 = [
  { place: "UC Cafeteria", lunch: 120, tea: 50 },
  { place: "Hostel", lunch: 50, tea: 120 },
  { place: "UC Cafeteria", lunch: 120, tea: 50 },
  { place: "Hostel", lunch: 50, tea: 120 },
];


  

export default function Home() {

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
                              <Table.Th></Table.Th>
                              <Table.Th>Lunch</Table.Th>
                              <Table.Th>Tea</Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>{rows2}</Table.Tbody>
                        </Table>
                    </div>
                  </div>
              </div>
            </div>
        </div>
        
      </main>
    )
  }