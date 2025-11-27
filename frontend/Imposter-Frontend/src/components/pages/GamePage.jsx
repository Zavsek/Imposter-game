import React from 'react'
import { useIgraStore } from '../../store/useIgraStore';


const GamePage = () => {
  const {gameInstance} = useIgraStore();
  return (
    <div className='w-screen h-screen bg-black '>{gameInstance.koda}</div>
  )
}
export default GamePage;