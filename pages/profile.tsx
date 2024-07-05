import Layout from "../components/Layout";
import gql from "graphql-tag";
import client from "../lib/apollo-client";
import Profile, { ProfileProps } from "../components/Profile";

const Profiles: React.FC<{ data: { profiles: ProfileProps[] } }> = (props) => {
  const profiles = props.data?.profiles ?? []; // Ensure profiles is an array

  return (
    <Layout>
      <div className="page">
        <h1>Profiles</h1>
        <main>
          {profiles.length > 0 ? (
            profiles.map((profile) => (
              <div key={profile.id} className="post">
                <Profile profile={profile} />
              </div>
            ))
          ) : (
            <p>No profiles found</p>
          )}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  );
};

export const getServerSideProps = async () => {
  const { data } = await client.query({
    query: gql`
    query ProfileQuery {
      profiles{
        id
        bio
        user {
          id
          email
          name
        }
      }
    }
    `,
  });

  return {
    props: {
      data,
    },
  };
};

export default Profiles;
