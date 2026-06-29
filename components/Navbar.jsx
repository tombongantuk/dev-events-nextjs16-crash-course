"use client"

import Image from "next/image"
import Link from "next/link"
import { trackCreateEventNavClicked, trackHomeNavClicked, trackEventsNavClicked } from "@/app/actions"

const Navbar = () => {
  return (
    <header>
      <nav>
        <Link href={"/"} className="logo">
          <Image src="/icons/logo.png" alt="logo" width={24} height={24} />
          <p>DevEvent</p>
        </Link>
        <ul>
          <Link href={"/"} onClick={trackHomeNavClicked}>Home</Link>
          <Link href={"/"} onClick={trackEventsNavClicked}>Event</Link>
          <Link href={"/"} onClick={trackCreateEventNavClicked}>Create Event</Link>
        </ul>
      </nav>
    </header>
  )
}

export default Navbar