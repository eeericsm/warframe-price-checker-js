import styles from './styles/Card.module.css';

export default function Card({ item, category, showDetails }) {
    
    const name = item.slug.split("_").join(" ");
    
    // Determine the correct price and label based on category
    let priceToDisplay = 'N/A';
    let priceLabel = 'Price:';
    let nameSuffix = '';
    let secondaryDetails = null;
    
    let marketMainUrlSlug = item.slug;
    
    if (category === 'arcanes') {
        priceToDisplay = item.prices?.max;
        priceLabel = 'Max Rank Price:';
        
        if (showDetails) {
            secondaryDetails = (
                <div className={styles.detailsBox}>
                    <hr className={styles.divider} />
                    <p><span>Unranked:</span> {item.prices?.min || 'N/A'}</p>
                </div>
            );
        }
    } else if (category === 'mods') {
        priceToDisplay = item.prices?.min;
        priceLabel = 'Unranked Price:';
        
        if (showDetails) {
            secondaryDetails = (
                <div className={styles.detailsBox}>
                    <hr className={styles.divider} />
                    <p><span>Max Rank:</span> {item.prices?.max || 'N/A'}</p>
                </div>
            );
        }
    } else {
        priceToDisplay = item.prices?.set;
        priceLabel = 'Set Price:';
        nameSuffix = ' set'; // Only warframes, weapons, companions are "sets"
        marketMainUrlSlug = `${item.slug}_set`;
        
        if (showDetails && item.prices?.parts) {
            secondaryDetails = (
                <div className={styles.detailsBox}>
                    <hr className={styles.divider} />
                    {Object.entries(item.prices.parts).map(([partSlug, price]) => {
                        // Clean up the part name (e.g., "frost_prime_chassis_blueprint" -> "chassis blueprint")
                        const cleanPartName = partSlug.replace(item.slug + '_', '').split("_").join(" ");
                        const marketPartUrl = `https://warframe.market/items/${partSlug}?type=sell`;
                        
                        return (
                            <p key={partSlug} className={styles.partRow}>
                                <a href={marketPartUrl} target="_blank" rel="noopener noreferrer" className={styles.marketLink}>
                                    <span className={styles.partName}>{cleanPartName}:</span>
                                </a> {price}
                            </p>
                        );
                    })}
                </div>
            );
        }
    }
    
    const mainMarketUrl = `https://warframe.market/items/${marketMainUrlSlug}?type=sell`;
    
    return (
        <div className={styles.card}>
            <a href={mainMarketUrl} target="_blank" rel="noopener noreferrer" className={styles.marketMainLink}>
                <h3 className={styles.title}>{name}{nameSuffix}</h3>
            </a>
            <p className={styles.mainPrice}>{priceLabel} {priceToDisplay || 'N/A'}</p>
            {secondaryDetails}
        </div>
    );
}