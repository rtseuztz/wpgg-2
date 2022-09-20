import type { NextApiRequest, NextApiResponse } from 'next'
const key: string = process.env.API_KEY || "";
type Data = {
    name: string
}
type user = {
    accountId: string,
    id: string,
    name: string,
    profileIconId: number,
    puuid: string,
    revisionDate: number,
    summonerLevel: number
}
type reqData = {
    name: string
}
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<user>
) {
    console.log(key);
    const { name } = req.query
    if (!name) {
        res.status(404);
        return;
    }
    console.log(req.body)
    //check db first, else pull from stuff
    const queryString = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + name + "?api_key=" + key;
    const userRes = await fetch(queryString)
    const user: user = await userRes.json()
    res.status(200).json(user)

}
