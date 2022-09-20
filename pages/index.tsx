import type { NextPage } from 'next'
import Link from 'next/link'
import { useRef, useState } from 'react'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const [inputName, setInputName] = useState("")
  const [name, setName] = useState("LOLPal")
  const searchBtn = useRef<HTMLAnchorElement>(null)
  const handleChange = (e: any) => {
      setInputName(e.target.value)
  }
  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          redirectToUser()
      }
  }
  const handleClick = (e: React.MouseEvent) => {
      redirectToUser()
  }
  const redirectToUser = () => {
      console.log("redirecting...")
      setName(inputName)
      searchBtn.current?.click()
  }
  // onChange={this.handleChange} 
  return (
      <div className={styles.main}>
          <nav>
              <div className="sticky">
                  <div>{name}</div>
                  {/*
                  <div htmlFor="summoner_name_input" id="summoner_name_input_label">Enter your summoner name</div>*/}
                  <input id="summoner_name_input" name="summonerNameInput" placeholder="Search for a player..." onChange={handleChange}  onKeyDown={handleKeyDown}/>
                  <Link  href={'/summoner/' + inputName}>
                    <a ref={searchBtn}>Search</a>
                  </Link>
              </div>
          </nav>
      </div>
  );
}

export default Home
