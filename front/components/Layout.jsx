import { Outlet } from 'react-router-dom'
//
import Header from './Header'
import Footer from './Footer'
//
import styles from './styles/Layout.module.css';

export default function Layout() {
    return(
        <div className={styles.container}>
            <Header />
            <main className={styles.mainContent}>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}