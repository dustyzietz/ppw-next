import React from 'react'

interface ButtonProps {
  onClick?: () => void;
  text: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, text }) => {
  return (
    <div onClick={onClick} className='inline-block rounded-sm p-4 px-8 bg-red-700 text-white'>{text}</div>
  )
}

export default Button