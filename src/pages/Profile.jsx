import React, { useEffect, useState } from 'react'
import { useAuth } from '../utils/AuthContext'

const Profile = () => {
  const [user, setUser] = useState(null)
  const { getCurrentUserInfo } = useAuth()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUserInfo()
        setUser(currentUser)
      } catch (error) {
        console.log('Error fetching user data:', error)
      }
    }

    fetchUser()
  }, [])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="container">
      <h1>Welcome to my profile!</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  )
}

export default Profile