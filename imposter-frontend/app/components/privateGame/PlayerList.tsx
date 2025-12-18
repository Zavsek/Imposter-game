import { FaTrashAlt } from "react-icons/fa";
import { VscChevronRight } from "react-icons/vsc";

interface PlayerListProps {
  players: string[];
  hostUsername: string | null;
  onRemove: (name: string) => void;
  disabled: boolean;
}

export const PlayerList = ({ players, hostUsername, onRemove, disabled }: PlayerListProps) => (
  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar border-2 border-black/50 rounded-md p-2 bg-black/20">
    {players.length === 0 ? (
      <p className="text-white/50 text-center py-4 italic text-sm">Add some suspects...</p>
    ) : (
      <ul className="space-y-2">
        {players.map((name, index) => (
          <li 
            key={index} 
            className={`flex justify-between items-center p-2 rounded-sm font-primary text-sm transition-all ${
              name === hostUsername ? 'bg-blue-900/40 border border-blue-400/30' : 'bg-black/40 border border-white/5'
            }`}
          >
            <span className="flex items-center gap-2 truncate">
              <VscChevronRight className="text-[#FF493C] shrink-0"/>
              <span className="truncate">{name}</span>
              {name === hostUsername && <span className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter shrink-0">(Host)</span>}
            </span>
            <button
              onClick={() => onRemove(name)}
              disabled={name === hostUsername || disabled}
              className="text-white/30 hover:text-[#FF493C] transition p-1 disabled:opacity-0"
            >
              <FaTrashAlt size={14} />
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
);