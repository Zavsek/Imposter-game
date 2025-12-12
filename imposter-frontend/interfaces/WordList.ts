import WordItem from "./WordItem";
interface WordList {
    name: string;
    items: WordItem[];
    type: 'preset' | 'custom';
}
export default WordList;