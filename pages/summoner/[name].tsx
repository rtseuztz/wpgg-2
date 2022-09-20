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
    var { name } = router.query;
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

    useEffect(() => {
        console.log(useEffect)
        setInputName(inputName)
        searchUser()
    }, [name])
    useEffect(() => {
        const runner = async () => {
            if (!user) return;
            let currentGames = [];
            const gameList = await loadGames(user.puuid)
            console.log(!gameList)
            if (gameList && gameList.length > 0) {
                currentGames = gameList;
                console.log("ISWORKING!! !");
                setOldData({ level: user.summonerLevel, name: user.name })
                setGames(gameList)
            }
        }
        runner();
    }, [user])

    const getUser = async (inputName: string): Promise<user> => {
        const res = await fetch("/api/user?name=" + inputName)
        if (res.status != 200) {
            return new Promise((res, rej) => rej("User not found"))
        } else {
            return res.json();
        }
    }
    const loadGames = async (puuid: string): Promise<game[]> => {
        const res = await fetch(`/api/match?puuid=${user.puuid}`)
        if (res.status != 200) {
            return new Promise((res, rej) => rej("Games not found"))
        } else {
            return res.json();
        }
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
        const user = await getUser(inputName)
        setUser(user);
        console.log(user);

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
                    const win = gameUser.win ? GameClass.Win.Win : GameClass.Win.Lose

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
        let team2: any[] = [];
        console.log(participants)
        for (const p in participants) {
            const player = participants[p];
            player.teamId === 100
                ? team1.push(player)
                : team2.push(player);
        }
        console.log("team 1 is :" + team1 + "\n team 2 is " + team2)
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