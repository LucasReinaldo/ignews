import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { signIn, signOut, useSession } from "next-auth/client";

import styles from "./styles.module.scss";

export function SigninButton() {
  const [session, loading] = useSession();

  console.log(session);

  return (
    <button
      type="button"
      className={styles.container}
      onClick={() => (session ? signOut() : signIn("github"))}
    >
      <FaGithub size={24} color={session ? "#04d361" : "#eba417"} />
      {loading
        ? "Loading..."
        : session
        ? `${session.user.name}`
        : "Sign in with Github"}
      {session && (
        <FiX size={20} color="#737380" className={styles.closeIcon} />
      )}
    </button>
  );
}
