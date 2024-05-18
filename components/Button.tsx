import React from 'react'

interface ButtonProps {
  onClick?: () => void;
  text: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, text, className }) => {
  return (
    <div onClick={onClick} className={`font-normal text-base inline-block rounded-sm p-3 px-8 text-white cursor-pointer bg-red-700 ${className}`}>
      {text}
    </div>
  );
}

export default Button;
