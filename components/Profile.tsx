import React from 'react'
import Router from 'next/router'
import ReactMarkdown from 'react-markdown'

export type ProfileProps = {
  id: number;
  bio: string;
  user: {
    id:number;
    name: string;
    email:string;
  }
}

const Profile: React.FC<{profile: ProfileProps}> = ({ profile }) => {
  return (
    <div onClick={() => Router.push('/pro/[id]', `/pro/${profile.id}`)}>
        <h2>{profile.id}</h2>
        <small>By {profile.user.name}</small>
        <ReactMarkdown children={profile.bio} />
        <style jsx>{`
          div {
            color: inherit;
            padding: 2rem;
          }
        `}</style>
    </div>
  )
}

export default Profile