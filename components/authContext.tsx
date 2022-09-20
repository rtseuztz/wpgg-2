import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, User, UserCredential } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react'
import { getFirestore, getDoc, collection, Firestore, query, where, doc, DocumentData, getDocs, setDoc, addDoc, FieldValue, updateDoc, DocumentReference, arrayUnion, CollectionReference, onSnapshot, DocumentSnapshot, Query, QuerySnapshot, deleteDoc } from 'firebase/firestore'
import { LayoutProps } from './layout/layout';
import { getAllContexts } from 'svelte';
import { JSDocMemberName } from 'typescript';
// https://stackoverflow.com/questions/68104551/react-firebase-authentication-and-usecontext
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app);


export interface AuthContextInterface {
  currentUser: User | null | undefined,
  getUser: () => User | null,
  login: (email: string, password: string) => Promise<UserCredential>,
  signOut: () => Promise<void>
  signUp: (email: string, password: string) => Promise<UserCredential>
}
const AuthContext = createContext<AuthContextInterface>({} as AuthContextInterface)

export function useAuth() {
  return useContext(AuthContext)
}

export interface DataContextInterface {
  getData: () => Array<job>,
  addJob: (job: newJob) => void,
  getFilters: () => Array<filter>,
  addFilter: (f: newFilter) => void,
  deleteFilter: (fid: string) => void,
}

const DataContext = createContext<DataContextInterface>({} as DataContextInterface)

export function useData() {
  return useContext(DataContext)
}
type jobArr = {
  jobs: Array<string>
}

type jobObj = {
  jid: string,
  job: job
}
export type filter = {
  fid: number,
  key: keyof job,
  comparator: string,
  value: string | number | Date,
}
export type newFilter = {
  key: keyof job,
  comparator: string,
  value: string | number | Date
}
export type TimeStamp = {
  seconds: number,
  nanoseconds: number
}
export type status = "applied" | "interviewing" | "waiting" | "offer" | "rejected"
export type job = {
  company: string,
  salary: number,
  title: string,
  jid: string,
  date: Date,
  status: status
}
export type newJob = {
  title: string,
  company: string,
  salary: number,
  date: Date,
  status: status
}

export function AuthProvider({ children }: LayoutProps) {
  const [currentUser, setCurrentUser] = useState<User | null>()
  const [userData, setUserData] = useState<Array<job>>([])
  const [userFilters, setUserFilters] = useState<Array<filter>>([])
  const [userRef, setUserRef] = useState<DocumentReference<DocumentData> | undefined>(undefined)
  const [jobsRef, setJobsRef] = useState<Query<DocumentData> | undefined>(undefined)
  const [filterRef, setFilterRef] = useState<Query<DocumentData> | undefined>(undefined)
  const [jobsCol, setJobsCol] = useState<CollectionReference<DocumentData> | undefined>(undefined)
  const [filtersCol, setFiltersCol] = useState<CollectionReference<DocumentData> | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  function signOut() {
    return auth.signOut();
  }

  function signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  function getUser() {
    return auth.currentUser
  }

  function getData() {
    return userData
  }

  function getFilters() {
    return userFilters
  }

  async function addJob(job: newJob) {
    if (!jobsCol || !currentUser) {
      console.error("no user ref")
      return;
    }
    const docRef = await addDoc(jobsCol, {
      uid: currentUser.uid,
      company: job.company,
      title: job.title,
      salary: job.salary,
      date: job.date,
      status: job.status
    });
  }
  async function addFilter(f: newFilter) {
    if (!filtersCol || !currentUser) {
      console.error("no user ref")
      return;
    }
    const docRef = await addDoc(filtersCol, {
      key: f.key,
      comparator: f.comparator,
      value: f.value,
    });
  }
  async function deleteFilter(fid: string) {
    if (!filtersCol || !currentUser) {
      console.error("no user ref")
      return;
    }
    const docRef = await deleteDoc(doc(filtersCol, fid))
  }
  //   function isAdmin() {
  //     return auth.currentUser.getIdTokenResult()
  //     .then((idTokenResult) => {
  //       if (!!idTokenResult.claims.admin) {
  //         return true
  //       } else {
  //         return false
  //       }
  //     })
  //   }

  //   function isEditor() {

  //   }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])
  /**
   * Job getter
   */
  useEffect(() => {
    const workerFunc = async (doc: QuerySnapshot<DocumentData>) => {
      let tempJobArr: Array<job> = [];
      doc.forEach((q: any) => {
        console.log(q.data())
        var dataObj = q.data()
        dataObj.jid = q.id;
        dataObj.date = dataObj.date ? new Date((dataObj.date as TimeStamp).seconds * 1000) : dataObj.date
        const jobObj = dataObj as job
        tempJobArr.push(jobObj)
      })
      setUserData(tempJobArr)
    }
    if (!jobsRef || !currentUser) return
    const unsub = onSnapshot(jobsRef, async (querySnap: any) => {
      setLoading(true)
      await workerFunc(querySnap)
      setLoading(false)
    });
    return unsub
  }, [currentUser, jobsRef])
  /**
   * Filter getter
   */
  useEffect(() => {
    const workerFunc = async (doc: QuerySnapshot<DocumentData>) => {
      let tempFilterArray: Array<filter> = [];
      doc.forEach((q: any) => {
        var dataObj = q.data()
        dataObj.fid = q.id;
        const filterObj = dataObj as filter
        tempFilterArray.push(filterObj)
      })
      setUserFilters(tempFilterArray)
    }
    if (!filterRef || !currentUser) return
    const unsub = onSnapshot(filterRef, async (querySnap: any) => {
      setLoading(true)
      await workerFunc(querySnap)
      setLoading(false)
    });
    return unsub
  }, [currentUser, filterRef])
  useEffect(() => {
    if (!currentUser) {
      setUserData([]);
      return;
    }
    const loadInData = async () => {
      const jobsCollection = collection(db, `users/${currentUser!.uid}/jobs`)
      const filtersCollection = collection(db, `users/${currentUser!.uid}/filters`)
      setJobsCol(jobsCollection)
      setFiltersCol(filtersCollection)
      const jobRef = query(jobsCollection)
      const filterRef = query(filtersCollection)
      setFilterRef(filterRef)
      setJobsRef(jobRef)
    }
    console.log("auth email is " + currentUser?.email)
    //get new user data
    loadInData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, currentUser?.email])

  const value = {
    currentUser,
    getUser,
    login,
    signOut,
    signUp,
  }
  const dataValue: DataContextInterface = {
    getData,
    addJob,
    getFilters,
    addFilter,
    deleteFilter
  }
  return (
    <AuthContext.Provider value={value}>
      <DataContext.Provider value={dataValue}>
        {!loading && children}
      </DataContext.Provider>
    </AuthContext.Provider>
  )

}