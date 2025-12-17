import participant from "./participant"

interface privateGameDetails{
    id:number,
    word:string,
    imposterHint:string,
    participants:participant[]
}
export default privateGameDetails;