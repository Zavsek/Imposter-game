

import drinks from './data/drinks.json';
import history from './data/history.json';


import { WordList } from '@/interfaces';



export const PRESET_WORD_LISTS: WordList[] = [
    { 
        name: "Drinks & Beverages", 
        items: drinks, 
        type: 'preset' 
    },
    { 
        name: "Ancient History", 
        items: history, 
        type: 'preset' 
    },
    {
        name: "Custom Word",
        items: [],
        type: 'custom'
    }
];