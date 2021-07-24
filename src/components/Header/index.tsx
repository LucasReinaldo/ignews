import { SigninButton } from 'components/SigninButton';
import Image from 'next/image'
import logo from '../../../public/images/logo.svg';

import styles from './styles.module.scss';

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image src={logo} width="100" height="100" alt="ig.news" />
        <nav>
          <a href="#" className={styles.active}>Home</a>
          <a href="#">Posts</a>
        </nav>
        <SigninButton />
      </div>
    </header>
  )
}
