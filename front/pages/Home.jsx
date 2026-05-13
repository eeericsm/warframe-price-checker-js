import { Link } from "react-router-dom"
//
import styles from "./styles/Home.module.css"

export default function Home() {
    return (
        <div className={styles.container}>
            <h1>Warframe Price Checker</h1>
            <section className={styles.btnContainer}>
                <div className={styles.btnRow}>
                    <Link className={styles.btn} to="/warframes">Warframes</Link>
                    <Link className={styles.btn} to="/weapons">Weapons</Link>
                    <Link className={styles.btn} to="/companions">Companions</Link>
                </div>
                <div className={styles.btnRow}>
                    <Link className={styles.btn} to="/arcanes">Arcanes</Link>
                    <Link className={styles.btn} to="/mods">Mods</Link>
                </div>
            </section>
        </div>
    )
};