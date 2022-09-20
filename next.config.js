/** @type {import('next').NextConfig} */
module.exports = (phase) => {
  reactStrictMode = true
  swcMinify = true
  const env = {
    apiKey: "AIzaSyAtSsS_sDU_yAGWH6u8xGvPicdRoZFmhK0",
    authDomain: "lol-app-c1a4e.firebaseapp.com",
    projectId: "lol-app-c1a4e",
    storageBucket: "lol-app-c1a4e.appspot.com",
    messagingSenderId: "413256750228",
    appId: "1:413256750228:web:e1acff64bdbe833b569081",
    measurementId: "G-TZKHMBDDFW"
  }
  return {
    env
  }
}
