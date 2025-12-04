import participant from "../privateGameTypes/participant"
interface publicGameDetails{
    id:number,
    word:string,
    hint:string,
    participants:Array<participant>
}
export default publicGameDetails;