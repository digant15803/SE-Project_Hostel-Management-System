"use client";
import Image from "next/image";
import Navbar from "@/components/navbar/Navbar";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ReactElement } from "react";
import RegComp from "@/components/viewbooking/bookingDetails";

import {
  Text,
  Table,
  ScrollArea,
  TableData,
  TextInput,
  Button,
  Space,
  Center,
  Checkbox,
  Select,
  Radio,
  Group, 
  Modal
} from "@mantine/core";

import styles from "@/app/student/page.module.css";
import star from "@/assets/booking/Star 1.svg";



const elements = [
  [6, 12.011, ["C", "N"], "Carbon"],
  [7, 12.011, ["C", "N"], "Carbon"],
  [8, 12.011, ["C", "N"], "Carbon"],
  [9, 12.011, ["C", "N"], "Carbon"],
  [10, 12.011, ["C", "N"], "Carbon"],
  [11, 12.011, ["C", "N"], "Carbon"],
  [12, 12.011, ["C", "N"], "Carbon"],
  [13, 12.011, ["C", "N"], "Carbon"],
  [14, 12.011, ["C", "N"], "Carbon"],
  [15, 12.011, ["C", "N"], "Carbon"],
  [16, 12.011, ["C", "N"], "Carbon"],
  [17, 12.011, ["C", "N"], "Carbon"],
  // [7, 14.007, 'N', 'Nitrogen'],
  // [39, 88.906, 'Y', 'Yttrium'],
  // [56, 137.33, 'Ba', 'Barium'],
  // [58, 140.12, 'Ce', 'Cerium'],
];

const elements2 = [
  { timeSlot: "11:30", BedSheetChange: "Yes", name: "Vatsal" },
  // { timeSlot: "11:30", BedSheetChange: "Yes", name: "Vatsal" },
];

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const closeOrderModal = () => {
    router.push("/student");
  };
  let seasonsList = [];

  function roer(subR) {
    seasonsList = [];
    subR.forEach((season, index) => {
      seasonsList.push(
        <Center>
          <div>{season}</div>
        </Center>
      );
      if (index < subR.length - 1) {
        seasonsList.push(<Space h="sm" />);
      }
    });
  }

  const rows = elements.map((element) => (
    <Table.Tr key={element[0]}>
      <Table.Td>
        <Center>
          <div>{element[0]}</div>
        </Center>
      </Table.Td>
      <Table.Td>
        <Center>
          <div>{element[1]}</div>
        </Center>
      </Table.Td>
      {roer(element[2])}
      <Table.Td>{seasonsList}</Table.Td>
      <Table.Td>
        <Center>
          <div>{element[3]}</div>
        </Center>
      </Table.Td>
    </Table.Tr>
  ));

  const rows2 = elements2.map((element) => (
    <Table.Tr key={element.timeSlot}>
      <Table.Td>{element.timeSlot}</Table.Td>
      <Table.Td>{element.BedSheetChange}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
    </Table.Tr>
  ));
  return (
    <main>
      <div className={styles.mainContainer}>
        <Navbar userT="student" />

        <div className={styles.content}>
          <div className={styles.leftContainer}>
            <div className={styles.headingText2}>
              <Text ta="center" className={styles.headingText}>
                House Keeping
              </Text>
            </div>
            <div className={styles.leftsubContainer}>
              <div className={styles.shift}>
                <div className={styles.star}>
                  <Image src={star} alt="time" />
                </div>
                <div className={styles.star}>
                  <Image src={star} alt="time" />
                </div>
              </div>
              <div className={styles.slot}>
                <div className={styles.slot1}>
                  <div className={styles.subheading}>
                    <Text className={styles.subheading}>Morning</Text>
                  </div>
                  <div className={styles.slottime}>
                    <Button
                      color="lime.4"
                      variant="filled"
                      // rightIcon={<Image src={FlowIcon} alt="Flow Icon" />}
                      size="md"
                      classNames={{
                        root: styles.defaultRadius,
                      }}
                      // onClick={authenticateUser}
                    >
                      First
                      <br />
                      second
                    </Button>
                    <Button
                      // rightIcon={<Image src={FlowIcon} alt="Flow Icon" />}
                      size="md"
                      classNames={{
                        root: styles.defaultRadius,
                      }}
                      // onClick={authenticateUser}
                    >
                      First
                      <br />
                      second
                    </Button>
                  </div>

                  <div className={styles.subheading}>
                    <Text className={styles.subheading}>Evening</Text>
                  </div>
                  <div className={styles.slottime}>
                    <Button
                      // rightIcon={<Image src={FlowIcon} alt="Flow Icon" />}
                      size="md"
                      classNames={{
                        root: styles.defaultRadius,
                      }}
                      // onClick={authenticateUser}
                    >
                      First
                      <br />
                      second
                    </Button>
                    <Button
                      // rightIcon={<Image src={FlowIcon} alt="Flow Icon" />}
                      size="md"
                      classNames={{
                        root: styles.defaultRadius,
                      }}
                      // onClick={authenticateUser}
                    >
                      First
                      <br />
                      second
                    </Button>
                    <Button
                      // rightIcon={<Image src={FlowIcon} alt="Flow Icon" />}
                      size="md"
                      classNames={{
                        root: styles.defaultRadius,
                      }}
                      // onClick={authenticateUser}
                    >
                      First
                      <br />
                      second
                    </Button>
                  </div>
                </div>
                <div className={styles.bottom}>
                  <div className={styles.bedsheetChange}>
                    <Checkbox defaultChecked label="Change Bed-Sheet" />
                  </div>
                  <div className={styles.request}>
                    <Button
                      // rightIcon={<Image src={FlowIcon} alt="Flow Icon" />}
                      size="md"
                      classNames={{
                        root: styles.defaultRadius,
                      }}
                      // onClick={authenticateUser}
                    >
                      First
                      <br />
                      second
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.rightContainer}>
            <div className={styles.rightSubContainer1}>

            <div className={styles.headingText2}>
                <Text ta="center" className={styles.headingText}>
                  Laundry Booking
                </Text>
              </div>
              <div className={styles.laundryBooking}>
              <Select
                label="Select slot"
                placeholder="Select Timing"
                data={['React', 'Angular', 'Vue', 'Svelte']}
              />
              </div>

              {/* <div className={styles.headingText2}>
                <Text ta="center" className={styles.headingText}>
                  Place Preference
                </Text>
              </div> */}

              {/* <div className={styles.form2}>
                <div className={styles.form2Input}>
                  <Text>Lunch</Text>
                  <Radio.Group
                    name="lunchPlace"
                    label="Lunch"
                    withAsterisk
                  >
                    <Group mt="xs">
                      <Radio value="uc" label="UC Cafeteria" />
                      <Radio value="mess" label="Hostel Mess" />
                    </Group>
                  </Radio.Group>
                  <Radio.Group
                    name="teaPlace"
                    label="Tea"
                    withAsterisk
                  >
                    <Group mt="xs">
                      <Radio value="uc" label="UC Cafeteria" />
                      <Radio value="mess" label="Hostel Mess" />
                    </Group>
                  </Radio.Group>
                </div>
                <Button
                  // rightIcon={<Image src={FlowIcon} alt="Flow Icon" />}
                  size="md"
                  classNames={{
                    root: styles.defaultRadius,
                  }}
                  // onClick={authenticateUser}
                >
                  Confirm
                </Button>
              </div> */}
            </div>
            <div className={styles.rightSubContainer1}>

              <div className={styles.headingText2}>
                <Text ta="center" className={styles.headingText}>
                  Place Preference
                </Text>
              </div>

              <div className={styles.form2}>
                <div className={styles.form2Input}>
                  {/* <Text>Lunch</Text> */}
                  <Radio.Group
                    name="lunchPlace"
                    label="Lunch"
                    withAsterisk
                  >
                    <Group mt="xs">
                      <Radio value="uc" label="UC Cafeteria" />
                      <Radio value="mess" label="Hostel Mess" />
                    </Group>
                  </Radio.Group>
                  <Radio.Group
                    name="teaPlace"
                    label="Tea"
                    withAsterisk
                  >
                    <Group mt="xs">
                      <Radio value="uc" label="UC Cafeteria" />
                      <Radio value="mess" label="Hostel Mess" />
                    </Group>
                  </Radio.Group>
                </div>
                <Button
                  // rightIcon={<Image src={FlowIcon} alt="Flow Icon" />}
                  size="md"
                  classNames={{
                    root: styles.defaultRadius,
                  }}
                  // onClick={authenticateUser}
                >
                  Confirm
                </Button>
              
              {/* <div className={styles.headingText2}>
                <Text ta="center" className={styles.headingText}>
                  Laundry Booking
                </Text>
              </div>
              <div className={styles.laundryBooking}>
              <Select
                label="Select slot"
                placeholder="Select Timing"
                data={['React', 'Angular', 'Vue', 'Svelte']}
              /> */}
                {/* <Table
                  stickyHeader
                  stickyHeaderOffset={0}
                  horizontalSpacing="xl"
                  highlightOnHover
                  withTableBorder
                  withColumnBorders
                >
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Time Slot</Table.Th>
                      <Table.Th>Bed-Sheet Change</Table.Th>
                      <Table.Th>Name</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>{rows2}</Table.Tbody>
                </Table> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
          opened={searchParams.get('authModal') === "booking"}
          onClose={closeOrderModal}
          withCloseButton={false}
          size="md"
        >
          <RegComp/>
        </Modal>
    </main>
  );
}
