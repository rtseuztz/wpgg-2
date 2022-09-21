import React, { Component } from 'react';
import { JsxElement } from 'typescript';
import { images } from '../public/champion'
import gameStyles from '../styles/Game.module.css'
import Image from 'next/image'

type GameProps = {
    participantsComponent: JSX.Element
}
function Game(props: GameProps) {
    return (
        <div className={gameStyles.gameBox}>
            <div className={gameStyles.participantsBox}>{props.participantsComponent}</div>
        </div>
    );
}

enum Win {
    Win = "win",
    Lose = "lose"
}
type GameFacadeProps = {
    win: Win,
    gameStats: JSX.Element,
    gameDate: string,
    gameBox: JSX.Element,
    championIcon: string
}
class GameFacade extends Component<GameFacadeProps, {
    expand: string
}> {
    constructor(props: GameFacadeProps) {
        super(props);
        this.state = {
            expand: ""
        }
        this.handleClick = this.handleClick.bind(this);

    }

    handleClick(e: any) {
        switch (e.target.className) {
            case "fullScreen":
                console.log("full");
                break;
            default:
                if (this.state.expand === " expand") {
                    this.setState({
                        expand: ""
                    })
                } else {
                    this.setState({
                        expand: " expand"
                    })
                }
        }
    }
    override render() {
        return (
            <div className={[gameStyles.gameFacade, gameStyles[this.props.win], gameStyles[this.state.expand]].join(" ")} onClick={this.handleClick}>
                <div className="gameDisplay">
                    <Image
                        width={20}
                        height={20}
                        alt={this.props.championIcon}
                        className={gameStyles.championIcon}
                        src={`/champion/${this.props.championIcon}.png`} />
                    {/* <img
                        alt=""
                        className={gameStyles.championIcon}
                        src={images[this.props.championIcon + ".png"]}
                    /> */}
                    <div className={gameStyles.gameStats}>{this.props.gameStats}</div>
                    <div className={gameStyles.gameDate}>{this.props.gameDate}</div>
                    <div className={gameStyles.fullScreen}>
                        O
                    </div>
                </div>
                {this.props.gameBox}
            </div>
        );
    }
}
type ParticipantListProps = {
    team1: any[]
    team2: any[]
}
function ParticipantList(props: ParticipantListProps) {
    return (
        <div className={gameStyles.participantsList}>
            <ul className={gameStyles.team1}>{props.team1}</ul>
            <ul className={gameStyles.team2}>{props.team2}</ul>
        </div>
    );
}

enum Side {
    Left = "participantLeft",
    Right = "participantRight"
}
type ParticipantProps = {
    side: Side
    championIcon: string,
    summonerName: string,
}
function Participant(props: ParticipantProps) {
    return (
        <div className={gameStyles[props.side]}>
            <img alt="" className={gameStyles.championIcon} src={images[props.championIcon + ".png"]} />
            <div className={gameStyles.summonerName}>{props.summonerName}</div>
        </div>
    );
}
// class Participant extends Component<ParticipantProps> {
//     constructor(props: ParticipantProps) {
//         super(props);
//         this.state = {
//         }
//     }

//     override render() {
//         return (
//             <div className={this.props.side}>
//                 <Image alt="" className="championIcon" src={images[this.props.championIcon + ".png"]} />
//                 <div className="summonerName">{this.props.summonerName}</div>
//             </div>
//         );
//     }
// }
type GameStatsProps = {
    kda: string,
    longkda: string,
    score: number
}
class GameStats extends Component<GameStatsProps> {
    constructor(props: GameStatsProps) {
        super(props);
        this.state = {
        }
    }

    override render() {
        return (
            <div className={gameStyles.gameStats}>
                <div className={gameStyles.kda}>{this.props.kda}</div>
                <div className={gameStyles.longkda}>{this.props.longkda}</div>
                <div className={gameStyles.score}>{this.props.score}</div>
            </div>

        );
    }
}
export { Game, GameFacade, ParticipantList, Participant, GameStats, Side, Win }
    //export default GameModule.Game