import React from 'react'

interface ButtonProps {
  onClick?: () => void;
  text: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, text }) => {
  return (
    <div onClick={onClick} className='font-normal text-base inline-block rounded-sm p-4 px-8 bg-red-700 text-white cursor-pointer'>{text}</div>
  )
}

export default Button