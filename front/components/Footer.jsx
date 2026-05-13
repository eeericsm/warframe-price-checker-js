import { Link, NavLink } from 'react-router-dom'
//
import styles from './styles/Footer.module.css'

export default function Footer(){
    return(
        <footer className={styles.footer}>
            <Link to="https://warframe.market/" target="_blank" rel="noopener noreferrer">Warframe Market</Link>
            <Link to="https://github.com/eeericsm" target="_blank" rel="noopener noreferrer">Github</Link>
        </footer>
    )
}