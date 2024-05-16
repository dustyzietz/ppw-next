import React from 'react'

const ChatBubbles = () => {
  return (
    <div class="flex">
    <div class="container max-w-2xl mx-auto p-4">
      <div class="flex items-center justify-start">
        <div class="w-3 overflow-hidden">
          <div class="h-4 bg-green-400 rotate-45 transform origin-bottom-right rounded-sm"></div>
        </div>
        <div class="bg-green-400 p-4 my-6 rounded-lg flex-1">
          🔥🔥🔥🔥Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
          molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
          numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
          optio, eaque rerum!
        </div>
      </div>
      <div class="flex items-center justify-end">
        <div class="bg-blue-200 p-4 my-6 rounded-lg flex-1">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. 😅
        </div>
        <div class="w-3 overflow-hidden ">
          <div class="h-4 bg-blue-200 rotate-45 transform origin-top-left rounded-sm"></div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default ChatBubbles