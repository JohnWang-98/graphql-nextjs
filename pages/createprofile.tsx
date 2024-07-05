import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Router from "next/router";
import gql from "graphql-tag";
import { useMutation, useLazyQuery } from "@apollo/client";

const GET_USER_ID_BY_EMAIL = gql`
  query GetUserIdByEmail($email: String!) {
    user(email: $email) {
      id
    }
  }
`;

const CREATE_PROFILE_MUTATION = gql`
  mutation CreateProfileMutation($bio: String, $userId: Int!) {
    createProfile(bio: $bio, userId: $userId) {
      id
      bio
      user {
        id
        name
        email
      }
    }
  }
  
`;

const CreateDraftMutation = gql`
  mutation CreateDraftMutation(
    $title: String!
    $content: String
    $authorEmail: String!
  ) {
    createDraft(title: $title, content: $content, authorEmail: $authorEmail) {
      id
      title
      content
      published
      author {
        id
        name
      }
    }
  }
`


function Profile() {
  const [bio, setBio] = useState("");
  const [UserEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState(null);

  const [getUserIdByEmail, { data: userData, loading: userLoading, error: userError }] = useLazyQuery(GET_USER_ID_BY_EMAIL);
  const [createProfile, { data: profileData, loading: profileLoading, error: profileError }] = useMutation(CREATE_PROFILE_MUTATION);
  const [createDraft] =
    useMutation(CreateDraftMutation)
  useEffect(() => {
    if (userData && userData.user) {
      setUserId(userData.user.id);
    }
  }, [userData]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Fetch the user ID by email
  //   const { data: fetchedUserData } = await getUserIdByEmail({ variables: { email: UserEmail } });

  //   console.log("Fetched user data:", fetchedUserData);

  //   if (fetchedUserData && fetchedUserData.user) {
  //     try {
  //       await createProfile({
  //         variables: {
  //           bio,
  //           userId: fetchedUserData.user.id,
  //         },
  //       });
  //       console.log("Profile created:", profileData);
  //       Router.push("/profile");
  //     } catch (error) {
  //       console.error("Error creating profile:", error);
  //     }
  //   } else {
  //     console.error("User not found or userData is not updated");
  //   }
  // };

  return (
    <Layout>
      <div>
      <form
          onSubmit={async (e) => {
            e.preventDefault();

            // Fetch the user ID by email
            const { data: fetchedUserData } = await getUserIdByEmail({ variables: { email: UserEmail } });
        
            console.log("Fetched user data:", fetchedUserData);

            await createProfile({
              variables: {
                bio,
                userId: userId,
              },
            })
            Router.push("/drafts")
          }}
        >
          <h1>Create Profile</h1>
          <input
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="User (email address)"
            type="text"
            value={UserEmail}
          />
          <textarea
            cols={50}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio"
            rows={8}
            value={bio}
          />
          <input
            disabled={!bio || !UserEmail || userLoading}
            type="submit"
            value="Create Profile"
          />
          <a className="back" href="#" onClick={() => Router.push("/")}>
            Cancel
          </a>
          {userLoading && <p>Loading user...</p>}
          {userError && <p>Error fetching user: {userError.message}</p>}
          {profileLoading && <p>Creating profile...</p>}
          {profileError && <p>Error creating profile: {profileError.message}</p>}
        </form>
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        input[type="text"],
        textarea {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        input[type="submit"] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
        }

        .back {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
}

export default Profile;
