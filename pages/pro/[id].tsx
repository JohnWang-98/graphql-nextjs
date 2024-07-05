import Layout from "../../components/Layout"
import { useRouter } from "next/router"
import gql from "graphql-tag"
import client from "../../lib/apollo-client"
import { GetServerSideProps } from "next"
import { ProfileProps } from "../../components/Profile"

const Profiles: React.FC<{ data: { profile: ProfileProps } }> = (props) => {
  // console.log("asdfasdfasdfasdfasd",props);
  // const router = useRouter();
  // const { id } = router.query;

  // if (!props.data.profile) {
  //   return <div>Loading...</div>; // or handle the error appropriately
  // }

  let title = props.data.filterProfiles.id;

  return (
    <Layout>
      <div className="page">
        <h2>{title}</h2>
        <p>By {props.data.filterProfiles.user.name}</p>
        <p>{props.data.filterProfiles.bio}</p>
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = Number(Array.isArray(context.params?.id) ? context.params?.id[0] : context.params?.id)

  const { data } = await client.query({
    query: gql`
    query Profilequery($id: ID!){
      filterProfiles(id: $id) {
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
    variables: { id },
  });

  return {
    props: {
      data
    },
  };
}

export default Profiles;
