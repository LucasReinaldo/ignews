import { UserCanSee } from "components/UserCanSee";
import { useAuth } from "context/AuthContext";
import { setupAPI } from "services/api";
import { withSSRAuth } from "utils/withSSRAuth";

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const api = setupAPI(ctx);

  const { data } = await api.get("/me");
  console.log(data);

  return {
    props: {},
  };
});

export default function Dashboard() {
  const { signOut } = useAuth();
  return (
    <main>
      <h1>dash</h1>
      <UserCanSee permissions={["metrics.list"]}>
        <p>aaaaaaaa</p>
      </UserCanSee>
      <button type="button" onClick={signOut}>
        logout
      </button>
    </main>
  );
}
