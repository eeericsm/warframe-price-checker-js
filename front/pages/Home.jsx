import { Link } from "react-router-dom"
//
import styles from "./styles/Home.module.css"

export default function Home() {
    return (
        <div className={styles.container}>
            <h1>Warframe Price Checker</h1>
            <p>
                The prices are just an average of the first 5 being sold at a given moment.
                <br />
                Some of the prices may be severely wrong due to
                <ul>
                    <li>no offers</li>
                    <li>offers that differ too much from each other(outliers or trolls)</li>
                    <li>most of the offers being from offline players</li>
                    <li>new offers being created after the refresh</li>
                </ul>
            </p>
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