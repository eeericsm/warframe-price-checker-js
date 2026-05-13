import { Link, NavLink } from "react-router-dom"
//
import styles from './styles/Header.module.css'

export default function Header() {
    return(
        <header className={styles.header}>
            <Link to="/">Home</Link>
        </header>
    )
}