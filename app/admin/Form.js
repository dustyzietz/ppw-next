'use client'
import React, {useState} from 'react'

const Form = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  const handleSubmit = async () => {
    console.log(formData)
    const response = await fetch('https://pricepointwholesale.com/wp-json/jwt-auth/v1/token', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    console.log(response)
  }

  return (
    <form>
      <label>
        Username:
        <input
          type='text'
          value={formData.username}
          onChange={e => setFormData({...formData, username: e.target.value})}
        />
      </label>
      <label>
        Password:
        <input
          type='password'
          value={formData.password}
          onChange={e => setFormData({...formData, password: e.target.value})}
        />
      </label>
      <button type='button' onClick={handleSubmit}>Submit</button>

    </form>
  )
}

export default Form