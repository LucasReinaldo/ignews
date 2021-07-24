import { setupAPI } from "services/api";
import { withSSRAuth } from "utils/withSSRAuth";

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const api = setupAPI(ctx);

  const { data } = await api.get("/me");
  console.log(data);

  return {
    props: {},
  };
}, {
  permissions: ['metrics.list'],
  roles: ['administrator']
});

export default function Metrics() {
  return (
    <main>
      <h1>Metrics</h1>
    </main>
  );
}
