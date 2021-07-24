import { FormEvent, useState } from "react";

import { useAuth } from "context/AuthContext";

import styles from "styles/session.module.scss";
import { withSSRGuest } from "utils/withSSRGuest";

export const getServerSideProps = withSSRGuest(
  async (ctx) => {
    return {
      props: {},
    };
  }
);

export default function Session() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useAuth();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    await signIn({ email, password });
  }

  return (
    <main>
      <form onSubmit={handleSubmit} className={styles.container}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Log in</button>
      </form>
    </main>
  );
}
