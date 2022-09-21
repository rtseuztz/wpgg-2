// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import _ from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next'
import limiter from './ratelimiter';
const key: string = process.env.API_KEY || "";
const rateLimiter = new limiter(250, 10)
type Data = {
    name: string
}
type game = {
    info: any,
}
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<game[]>
) {
    const { puuid } = req.query
    if (!puuid) {
        res.status(404);
        return;
    }
    console.log(req.body)
    //check db first, else pull from stuff
    const queryString = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20&api_key=${key}`
    const userRes = await fetch(queryString)
    const gameIDs: string[] = await userRes.json()
    let games: game[] = []
    gameIDs.forEach((gameID: string) => {
        rateLimiter.addFunction(async () => {
            const resp = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/${gameID}?api_key=${key}`)
            const game = await resp.json();
            console.log(game);
            games.push(game);
            console.log("game added, games added = " + games.length);
            if (games.length == gameIDs.length) {
                res.status(200).json(games)
            }
        })
    })
    setTimeout(() => {
        res.status(404);
    }, 1000 * 30)

}
