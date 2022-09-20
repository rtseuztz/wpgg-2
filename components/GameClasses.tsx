import React, {Component} from 'react';
import { JsxElement } from 'typescript';
import {images} from '../styles/public/champion'
type GameProps =  {
    participantsComponent: JSX.Element
}
function Game(props: GameProps) {
    return (
        <div className="gameBox">
            <div className="participantsBox">{props.participantsComponent}</div>
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
            <div className={"gameFacade " + this.props.win + this.state.expand} onClick={this.handleClick}>
                <div className="gameDisplay">
                    <img 
                        alt=""
                        className="championIcon" 
                        src={images[this.props.championIcon + ".png"]} 
                        />
                    <div className="gameStats">{this.props.gameStats}</div>
                    <div className="gameDate">{this.props.gameDate}</div>
                    <div className='fullScreen'>
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
        <div className="participantList">
            <ul className="team1">{props.team1}</ul>
            <ul className="team2">{props.team2}</ul>
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
        <div className={props.side}>
            <img alt="" className="championIcon" src={images[props.championIcon + ".png"]} />
            <div className="summonerName">{props.summonerName}</div>
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
            <div className="gameStats">
                <div className="kda">{this.props.kda}</div>
                <div className="longKDA">{this.props.longkda}</div>
                <div className="score">{this.props.score}</div>
            </div>

        );
    }
}
export {Game, GameFacade, ParticipantList, Participant, GameStats, Side, Win}
    //export default GameModule.Game