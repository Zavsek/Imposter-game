interface UserDropdownProps {
  username: string;
  onLogout: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ username, onLogout }) => (
  <div className='absolute right-0 mt-3 w-56 bg-black border-4 border-[rgba(13,0,80,0.9)] shadow-[8px_8px_0px_0px_rgba(13,0,80,0.6)] z-50'>
    <div className='p-3 border-b border-[rgba(13,0,80,0.5)] bg-[rgba(13,0,80,0.2)]'>
      <p className='text-[10px] text-[#fa3d2f] uppercase font-black opacity-70'>Active Agent</p>
      <p className='text-white font-bold truncate text-lg'>{username}</p>
    </div>
    
    <button 
      onClick={onLogout}
      className='w-full text-left p-4 text-[#fa3d2f] hover:bg-[#fa3d2f] hover:text-black font-black uppercase italic transition-colors flex justify-between items-center group'
    >
      Logout
      <span className='transform group-hover:translate-x-1 transition-transform'>→</span>
    </button>
  </div>
);

export default UserDropdown;