import React, { Component, useEffect, useState } from 'react'
import * as GameClass from '../../components/GameClasses'
import _ from 'lodash';
import $ from 'jquery';
import { useRouter } from 'next/router';

// function GetParams() {
//     const webParams = useParams();
//     params = webParams
//     return <div></div>;
// }
// let params: any
type user = {
    name: string,
    puuid: string,
    summonerLevel: number
  }
  type game = {
    info: any,
  
  }
  type LOLPalProps = {
    string: never
  }

  /*
      name: string,
    inputName: string,
    level: number,
    games: game[],
    user: user
    */

function User() { 
    const router = useRouter();
    var {name} = router.query;
    name = typeof name == "string" ? name : "";
    name = name as string
    console.log(name);
    //const params = useParams()
    const [inputName, setInputName] = useState<string>(name)
    const [games, setGames] = useState<game[]>([])
    const [user, setUser] = useState<user>({
            name: "",
            puuid: "",
            summonerLevel: 0
    })
    const [oldData, setOldData] = useState({
        name: "",
        level: 0
    })

    useEffect(()=> {
        console.log(useEffect)
        setInputName(inputName)
        searchUser()
    }, [name])
        //   this.searchUser = this.searchUser.bind(this);
        //   this.handleKeyDown = this.handleKeyDown.bind(this);
        //   this.handleClick = this.handleClick.bind(this);
        //   this.handleChange = this.handleChange.bind(this);
        //   this.getUser = this.getUser.bind(this);
        //   this.loadGames = this.loadGames.bind(this);
        //   this.getGameRows = this.getGameRows.bind(this);
        //   //this.getLeftTab = this.getLeftTab.bind(this);
        //   this.getParticipants = this.getParticipants.bind(this);
        //   this.findChampion = this.findChampion.bind(this);
        //   this.getGameBox = this.getGameBox.bind(this);
          
      const getUser = (inputName: string): Promise<Response> => {
        const x = fetch("/api/user?name=" + inputName)
        return x;
        // return new Promise((res) => {
        //     $.get({
        //         url: '/user',
        //         data: {
        //             action: "getUser",
        //             name: inputName
        //         },
        //         success: function (result) {
        //             if (result === "Error") {
        //                 res(result);
        //             }
        //             //let user = JSON.parse(result);
        //             const user = result;
        //             console.log(user);
        //             res(user)
        //         }
        //     })
        // })
      }
      const loadGames = (puuid: string, callback: (gameList: game[]) => any): void => {
          $.ajax({
              type: "GET",
              url: "/api",
              data: {
                  action: "getGames",
                  puuid: puuid
              },
              success: function (result) {
                  if (result == "Error") {
                      callback(result);
                  }
                  //let gameList = JSON.parse(result);
                  const gameList = result;
                  console.log(gameList);
                  callback(gameList);
              }
          })
      }
      const handleClick = (e: any) => {
          searchUser();
      }
      const handleKeyDown = (event: { key: string; }) => {
          if (event.key == 'Enter') {
              searchUser();
          }
      }
      async function searchUser() {
          //let inputName = event.target.value
          const res = await getUser(inputName)
          const user: user = await res.json()
          console.log(user);
            if (user) {
            let currentGames = [];
            loadGames(user.puuid,  (gameList: Array<game>) => {
                console.log(!gameList)  
                if (gameList && gameList.length > 0) {
                    currentGames = gameList;
                    console.log("ISWORKING!! !");
                    setUser(user)
                    setOldData({level: user.summonerLevel, name: user.name})
                    setGames(gameList)
                //   this.setState({
                //       user: user,
                //       name: user.name,
                //       level: user.summonerLevel,
                //       games: currentGames,
                //   })
                }
            });
            }
      }
      const getGameRows = () => {
          const gameList: JSX.Element[] = []
  
          const gameArr = games ? _.sortBy(games, (game) => {
              return -game.info.gameCreation
          }) : [];
          console.log(games.length);
          for (const i in gameArr) {
              const game = gameArr[i];
              if (game !== undefined) {
                  console.log("147");
                  const participants = game.info.participants
                  const gameUser = _.find(participants, (x) => {
                      return x.summonerName === user.name
  
                  });
                  if (gameUser) {
                    const champion = gameUser.championName;
                    const gameDate = new Date(game.info.gameCreation).toLocaleDateString();
                    const gameStats = <GameClass.GameStats
                        kda={((gameUser.kills + gameUser.assists) / gameUser.deaths).toFixed(2)}
                        longkda={gameUser.kills + "/" + gameUser.deaths + "/" + gameUser.assists}
                        score={4}
                    />//user.kills + "/" + user.deaths + "/" + user.assists;
                    const participantsComponent: JSX.Element = getParticipants(participants);
                    const gameBox: JSX.Element = getGameBox(participantsComponent);
                    const win = gameUser.win? GameClass.Win.Win : GameClass.Win.Lose
    
                    gameList[i] = <GameClass.GameFacade
                        key={i}
                        win={win}
                        gameBox={gameBox}
                        championIcon={champion}
                        gameStats={gameStats}
                        gameDate={gameDate}
    
    
                    />;
                  }
              }
          }
          return <ol className="gameList">{gameList}</ol>;
      }
      const getGameBox = (participantsComponent: any) => {
          return <GameClass.Game
          participantsComponent={participantsComponent}
           />
      }
      const getParticipants = (participants: { [x: string]: any; }) => {
          let team1: any[] = [];
          let team2: any[]  = [];
          console.log(participants)
          for (const p in participants) {
              const player = participants[p];
              player.teamId === 100
                  ? team1.push(player)
                  : team2.push(player);
          }
          console.log("team 1 is :" + team1 + "\n team 2 is "+ team2)
          team1 = _.map(team1, (p) => {
              return <GameClass.Participant
                  side={GameClass.Side.Left}
                  key={p.summonerName}
                  summonerName={p.summonerName}
                  championIcon={p.championName}
              />
          });
          team2 = _.map(team2, (p) => {
              return <GameClass.Participant
                  side={GameClass.Side.Right}
                  key={p.summonerName}
                  summonerName={p.summonerName}
                  championIcon={p.championName}
              />
          });
          return (
              <div>
                  <GameClass.ParticipantList
                      team1={team1}
                      team2={team2}
                  />
              </div>
          )
  
      }
      const findChampion = () => {
          console.log("X");
      }
    return (
        <div className="contentBox">
            {getGameRows()}
        </div>
    );
}
export default User