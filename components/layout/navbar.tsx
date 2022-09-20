import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import navStyles from '../../styles/Navbar.module.css'
import { FormEvent, useEffect, useRef, useState } from 'react';
import { AuthContextInterface, DataContextInterface, useAuth, useData } from '../../components/authContext'
//import { Modal } from '../modal';
import Link from 'next/link'
//import _ from 'underscore'
const NavBar: NextPage = () => {
  const loginBtnRef = useRef<HTMLAnchorElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [warning, setWarning] = useState("")
  const auth: AuthContextInterface = useAuth()
  const data: DataContextInterface = useData()
  const userData = data.getData();
  const user = auth.getUser();
  const signUserOut = () => {
    auth.signOut()
  }
  const [shouldShowLoginModal, setShowLoginModal] = useState<boolean | undefined>(false)
  const showLoginModal = () => {
    setShowLoginModal(true)
  }
  const hideLoginModal = () => {
    setShowLoginModal(false)
    setWarning("")
  }


  const show = useRef<boolean | undefined>(true)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const container = modalRef.current
      if (!container) return;
      (container.contains(event.target as Node | null))
        ? ""
        : hideLoginModal()   // clicked in the modal
    }
    //hide
    document.body.addEventListener("click", handleClickOutside);
  }, [])

  const loginUser = async (e: FormEvent) => {
    if (!modalRef.current) return;
    const userName = modalRef.current.querySelector("#email") as HTMLInputElement
    const password = modalRef.current.querySelector("#password") as HTMLInputElement
    e.preventDefault();
    if (userName && password) {
      auth.login(userName.value, password.value)
        .then((res: any) => {
          hideLoginModal()
          setWarning("")
        })
        .catch((error: any) => {
          setWarning(error.message)
        })
    }
  }
  const createAccount = () => {
    window.location.href = "/new"
  }

  return (
    <nav className={navStyles.navBar}>

      <div className={navStyles.leftBtns}>
        <span className={[styles.logo, navStyles.hamburger].join(" ")}>
          <Image src="/hamburger.svg" alt="More options" title="More options..." width={72} height={22} />
        </span>
        <Link href="/">
          Job Tracker
        </Link>
      </div>
      {/* <>
        {user == null ?
          <div ref={modalRef} className={navStyles.loginContainer}>
            <div className={navStyles.buttonList}>
              <Link href="/new">
                <a className={navStyles.button}>Create an account</a>
              </Link>
              <a ref={loginBtnRef} className={navStyles.button} id="loginButton" onClick={showLoginModal}>Log in</a>
            </div>
            <Modal show={shouldShowLoginModal} element={loginBtnRef.current as Element}>
              <form action="/" className={navStyles.flexCol} onSubmit={e => loginUser(e)}>
                <input id="email" placeholder='email'></input>
                <input type="password" id="password" placeholder='password'></input>
                <button type="submit">login</button>
                {warning != "" ? <div>{warning}</div> : <></>}
              </form>

            </Modal>
          </div>
          :
          <div className={navStyles.flexRow}>
            <div>{user.email}</div>
            <button onClick={signUserOut}>Sign out</button>
          </div>
        }
      </> */}

    </nav>
  )
}
export default NavBar