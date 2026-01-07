import { VscChevronRight, VscCheck } from "react-icons/vsc";
import { PRESET_WORD_LISTS, PRESET_WORD_LISTS_SLO } from '@/lib/wordlists';

interface SelectorProps {
  selectedLists: string[];
  onSelect: (name: string) => void;
  onClose: () => void;
}

export const WordListSelector = ({ selectedLists, onSelect, onClose }: SelectorProps) => {
  

  const renderListGroup = (title: string, lists: typeof PRESET_WORD_LISTS) => (
    <div className="mb-6">
      <h5 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">
        {title}
      </h5>
      <div className="flex flex-col gap-1.5">
        {lists.map((list) => {
          const isSelected = selectedLists.includes(list.name);
          return (
            <button
              key={list.name}
              onClick={() => onSelect(list.name)}
              className={`w-full text-left p-3 rounded-lg transition-all flex justify-between items-center text-sm border ${
                isSelected 
                  ? 'bg-[#FF493C] border-[#FF493C] text-white font-bold shadow-[0_0_15px_rgba(255,73,60,0.3)]' 
                  : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-white border-white' : 'border-white/20'
                }`}>
                  {isSelected && <VscCheck className="text-[#FF493C]" size={12} />}
                </div>
                <span>
                  {list.name}
                  <span className={`ml-2 text-[10px] opacity-50 ${isSelected ? 'text-white' : ''}`}>
                    ({list.items.length})
                  </span>
                </span>
              </div>
              {!isSelected && <VscChevronRight className="opacity-30" />}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="absolute inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-6 z-60 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 shadow-2xl flex flex-col rounded-2xl overflow-hidden max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h4 className="text-xl font-black text-white uppercase tracking-tighter">
            Target Databases
          </h4>
          <div className="text-[10px] bg-white/10 px-2 py-1 rounded text-white/50 font-bold">
            {selectedLists.length} SELECTED
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {renderListGroup("Slovenski Seznami", PRESET_WORD_LISTS_SLO)}
          {renderListGroup("English Datasets", PRESET_WORD_LISTS)}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-black/20">
          <button
            onClick={onClose}
            className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-[#FF493C] hover:text-white transition-all active:scale-95"
          >
            CONFIRM SELECTION
          </button>
        </div>
      </div>
    </div>
  );
};