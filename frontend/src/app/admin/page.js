"use client"
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import Navbar from "@/components/navbar/Navbar"
import {Text, Table, TextInput, Button, Space, Center, Modal} from "@mantine/core"

import styles from "@/app/admin/page.module.css"
import { ReactElement } from "react";

import RegComp from "@/components/registration/RegComp";

const elements = [
    [6, 12.011, ['C','N'], 'Carbon'],
    [7, 12.011, ['C','N'], 'Carbon'],
    [8, 12.011, ['C','N'], 'Carbon'],
    [9, 12.011, ['C','N'], 'Carbon'],
    [10, 12.011, ['C','N'], 'Carbon'],
    [11, 12.011, ['C','N'], 'Carbon'],
    [12, 12.011, ['C','N'], 'Carbon'],
    [13, 12.011, ['C','N'], 'Carbon'],
    [14, 12.011, ['C','N'], 'Carbon'],
    [15, 12.011, ['C','N'], 'Carbon'],
    [16, 12.011, ['C','N'], 'Carbon'],
    [17, 12.011, ['C','N'], 'Carbon'],
    // [7, 14.007, 'N', 'Nitrogen'],
    // [39, 88.906, 'Y', 'Yttrium'],
    // [56, 137.33, 'Ba', 'Barium'],
    // [58, 140.12, 'Ce', 'Cerium'],
  ];

const elements2 = [
  { place: "UC Cafeteria", lunch: 120, tea: 50 },
  { place: "Hostel", lunch: 50, tea: 120 },
];


  

export default function Home() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const closeRegModal = () => {
    router.push("/admin");
  };

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
  
  const rows = elements.map((element) => (
    <Table.Tr key={element[0]}>
      <Table.Td><Center><div>{element[0]}</div></Center></Table.Td>
      <Table.Td><Center><div>{element[1]}</div></Center></Table.Td>
        {roer(element[2])}
      <Table.Td>{seasonsList}</Table.Td>
      <Table.Td><Center><div>{element[3]}</div></Center></Table.Td>
    </Table.Tr>
  ));

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