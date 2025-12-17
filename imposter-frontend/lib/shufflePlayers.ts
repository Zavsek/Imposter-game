import { participant } from "@/interfaces";
//Durstenfeld shuffle
export default function shufflePlayers(players:participant[]): participant[]{
    const shuffled =[...players];
    for(let i = shuffled.length -1; i>0; i--){
        let j = Math.floor(Math.random()*(i+1));
        let temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j]= temp;
    }
    return shuffled;
}
