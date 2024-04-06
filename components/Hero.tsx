import React from 'react'
import Image from 'next/image'

const Hero = ({ imageOverlay = false, textOverlay = false, text, image }: { imageOverlay?: boolean, textOverlay?: boolean, text?: string, image?: string }) => {
  return (
    <section className="relative">
    <div
        className={`absolute right-0 left-0 top-0 bottom-0 text-white flex justify-center align-center flex-col text-center ${
            imageOverlay ? "bg-opacity-60 bg-black " : ""
        }`}
    >
        <div
            className={`p-4 w-96 m-auto rounded-xl ${
                textOverlay ? " bg-opacity-70 bg-black " : ""
            }`}
        >
            <h1 className="text-3xl mb-4">
                Create Your Own Unique Products with Price Point
                Wholesale
            </h1>
        </div>
    </div>
    <Image
        height={800}
        width={1920}
        quality={80}
        src="/stock-packaging-home.jpeg"
        alt=""
        priority
        className=" w-full object-cover"
        style={{maxHeight: '600px'}}
    />
</section>
  )
}

export default Hero