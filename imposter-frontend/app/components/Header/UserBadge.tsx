import SVGDisguise from "../disguise.jsx";

interface UserBadgeProps {
  username: string;
  isOpen: boolean;
  onClick: () => void;
}

const UserBadge: React.FC<UserBadgeProps> = ({ username, isOpen, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center transition-all border-2 rounded-full overflow-hidden
      ${isOpen ? 'bg-[rgba(26,10,160,0.6)] border-[#fa3d2f]' : 'bg-[rgba(26,10,160,0.3)] border-transparent hover:border-[rgba(13,0,80,0.8)]'}`}
  >
    <div className="w-10 h-10 md:w-12 md:h-12 bg-[#fa3d2f] flex items-center justify-center border-2 border-black">
       <SVGDisguise className="w-6 h-6 md:w-8 md:h-8 fill-black" />
    </div>
    
    <div className='hidden md:flex items-center px-4 gap-2'>
      <span className='font-bold text-white uppercase tracking-widest text-sm truncate max-w-[100px]'>
        {username}
      </span>
      <span className={`text-[#fa3d2f] text-xs transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
        ▼
      </span>
    </div>
  </button>
);

export default UserBadge;