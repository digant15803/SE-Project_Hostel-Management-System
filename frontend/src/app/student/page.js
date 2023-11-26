"use client";
import React, { useState, useRef } from 'react';
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import Navbar from "@/components/navbar/Navbar";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ReactElement } from "react";
import RegComp from "@/components/viewbooking/bookingDetails";
import { gql, useMutation, useQuery } from "@apollo/client";

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
import {
  showSuccessNotification,
  showErrorNotification,
} from "@/utils/notifications.helper";

import styles from "@/app/student/page.module.css";
import star from "@/assets/booking/Star 1.svg";



const TIMESLOTDETAILS = gql`
  query timeSlotDetails {
    timeSlots {
      slotsAva
      time
    }
  }
`;

const BOOKSLOT = gql`
  mutation bookSlot($slotBook: slotBook) {
    rcSlotBooking(slotBook: $slotBook) {
      already
      flag
    }
  }
`;

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [desTime, setdesTime] = useState('');
  const [bookslot] = useMutation(BOOKSLOT);
  const [bedSheetCheck, setBedSheetCheck] = useState(false);
  var token;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem("token");
    if(token===null){
      router.push("/");
    }
    else{
      const info = jwtDecode(token);
      if(info.position==="Student"){
        router.push("/student");
      }
      else if(info.position==="Mess"){
        router.push("/mess");
      }
      else if(info.position==="House keeping"){
        router.push("/housekeeping");
      }
      else if(info.position==="admin"){
        router.push("/admin");
      }
      else{
        router.push("/");
      }
    }
  }
  const { loading, error, data } = useQuery(TIMESLOTDETAILS,{
    context: {
      headers: {
        authorization: token || "",
      },
    }
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  var timeSlotData = data.timeSlots;

  const getButtonStyle = (buttonId,remSlots) => {
    if(remSlots===0){
      return {disabled: true};
    }
    return desTime === buttonId ? {variant: 'filled'} : {variant: 'outline'};
  };


  const closeOrderModal = () => {
    router.push("/student");
  };

  const buttons = timeSlotData.map((d,index) => {
    return(
    <Button
      value={d.time}
      size="md"
      classNames={{
        root: styles.defaultRadius,
      }}
      onClick={(event) => {setdesTime(event.currentTarget.value)}}
      {...getButtonStyle(d.time,d.slotsAva)}
    >
      {d.time.slice(0,-3)}
      <br />
      {d.slotsAva}
    </Button>
)});

const morning = [buttons[0],buttons[1]];
const evening = buttons.slice(2);


const eventBookSlot = async () => {
    try {
      const {data} = await bookslot({
        variables: { "slotBook": {
          "bedSheetChangeReq": bedSheetCheck,
          "time": desTime
        }},
        context: {
          headers: {
            authorization: token || "",
          },
        },
      });
      console.log("SLOT BOOKED -- SUCCESS", data);
      if(data.already===true){
        showSuccessNotification(
          "Already Booked",
          "You or Your roommate has already booked."
        );
      }
      else if(data.flag===true){
        showSuccessNotification(
          "Slot Booked",
          "You have booked a slot for room cleaning."
        );
      }
      router.refresh();
      setBedSheetCheck(false);
      setdesTime("");
    } catch (error) {
      console.log("SLOT BOOKING -- ERROR", error);
      showErrorNotification("Failed to create user", error?.message);
    }
};

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
                    {morning}
                  </div>

                  <div className={styles.subheading}>
                    <Text className={styles.subheading}>Evening</Text>
                  </div>
                  <div className={styles.slottime}>
                  {evening}
                  </div>
                </div>
                <div className={styles.bottom}>
                  <div className={styles.bedsheetChange}>
                    <Checkbox checked={bedSheetCheck} onChange={(event) => setBedSheetCheck(event.currentTarget.checked)} label="Change Bed-Sheet" />
                  </div>
                  <div className={styles.request}>
                    <Button
                      size="md"
                      classNames={{
                        root: styles.defaultRadius,
                      }}
                      onClick={eventBookSlot}
                    >
                      Request
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
