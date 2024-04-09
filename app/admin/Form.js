'use client'
import React, {useEffect, useState} from 'react'


const Form = ({authenticated, setAuthenticated}) => {
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  useEffect(()=>{
    // check if auth token is valid
    const checkAuthToken = async () => {
      try {
        const response = await fetch('https://pricepointwholesale.com/wp-json/jwt-auth/v1/token/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // get token cookie
            'Authorization': `Bearer ${document.cookie.split('; ').find(cookie => cookie.startsWith('token='))?.split('=')[1]}`
          }
        });
        if (response.ok) {
          console.log('Token is valid');
          setAuthenticated(true)
        } else {
          console.log('Token is invalid');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    checkAuthToken()
  },[])

  const handleSubmit = async () => {
    try {
      const response = await fetch('https://pricepointwholesale.com/wp-json/jwt-auth/v1/token', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const responseData = await response.json();
      console.log(responseData); // This will log the parsed response data
      // Save token and user information to cookies
      document.cookie = `token=${responseData.token}; path=/`;
      document.cookie = `user_email=${responseData.user_email}; path=/`;
      document.cookie = `user_nicename=${responseData.user_nicename}; path=/`;
      document.cookie = `user_display_name=${responseData.user_display_name}; path=/`;
    } catch (error) {
      console.error('Error:', error);
    }
  };

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