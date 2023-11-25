"use client"
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {Text} from "@mantine/core";

import styles from "@/components/navbar/Navbar.module.css"

import Logo from "@/assets/general/Logo.svg"
import ProfilePhoto from "@/assets/general/ProfilePhoto.png"



export default function Navbar({userT}){
    const searchParams = useSearchParams();
    const type = searchParams.get('userType');
    return(
        <div className={styles.container}>
            <Image src={Logo} alt="FLH"/>
            {userT === "admin" && 
                <div className={styles.menu}>
                    <Link
                        href={{
                        pathname: "/admin",
                        query: { authModal: "registration" },
                        }}>
                        <Text fw={700}> User Registration </Text>
                    </Link>
                    <Link href={"/admin/userDetails"}>
                    <Text fw={700}> User Details </Text>
                    </Link>
                </div>
            }
            {userT === "student" && 
                <div className={styles.menu}>
                    <Link
                        href={{
                        pathname: "/student",
                        query: { authModal: "booking" },
                        }}>
                        <Text fw={700}> Your Booking </Text>
                    </Link>
                    
                </div>
            }

            <div className={styles.profileDiv}>
                <div className={styles.profile}>
                    <Text fw={700}>Virat Kohli</Text>
                    <div className={styles.profilePhoto}>
                        <Image src={ProfilePhoto} alt="ProfilePhoto" width={40} height={40} />
                    </div>
                </div>
            </div>
        </div>
    );
}