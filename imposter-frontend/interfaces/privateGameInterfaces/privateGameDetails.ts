import participant from "./participant"

interface privateGameDetails{
    id:number,
    word:string,
    imposterHint:string,
    participants:Array<participant>
}
export default privateGameDetails;