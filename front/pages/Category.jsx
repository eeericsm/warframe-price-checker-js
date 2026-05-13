import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
//
import Card from '../components/Card';
//
import styles from './styles/Category.module.css';

export default function Category() {
    const { category } = useParams();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [sortOrder, setSortOrder] = useState('none'); // 'none' | 'desc' | 'asc'

    // Reset toolbar states when category changes
    useEffect(() => {
        setSortOrder('none');
        setShowDetails(false);
    }, [category]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch data from your backend route dynamically
                const response = await fetch(`http://localhost:8000/api/${category}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${category}`);
                }
                const data = await response.json();
                setItems(data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [category]); // Re-run effect if the category parameter changes

    // Helper to get the correct price depending on category
    const getPrimaryPrice = (item, cat) => {
        if (!item.prices) return 0;
        if (cat === 'arcanes') return item.prices.max || 0;
        if (cat === 'mods') return item.prices.min || 0;
        return item.prices.set || 0;
    };

    // Calculate the sorted items array to map below
    const sortedItems = [...items].sort((a, b) => {
        if (sortOrder === 'none') return 0;
        const priceA = getPrimaryPrice(a, category);
        const priceB = getPrimaryPrice(b, category);
        
        if (sortOrder === 'desc') return priceB - priceA; // Highest first
        return priceA - priceB; // Lowest first
    });

    const toggleSort = () => {
        if (sortOrder === 'none') setSortOrder('desc');
        else if (sortOrder === 'desc') setSortOrder('asc');
        else setSortOrder('none');
    };

    const getSortText = () => {
        if (sortOrder === 'none') return "Sort: Default";
        if (sortOrder === 'desc') return "Sort: Highest First";
        return "Sort: Lowest First";
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{category}</h2>
            <section className={styles.dataContainer}>                
                <div className={styles.toolbar}>
                    <button 
                        className={styles.toggleBtn}
                        onClick={toggleSort}
                    >
                        {getSortText()}
                    </button>
                    <button 
                        className={styles.toggleBtn}
                        onClick={() => setShowDetails(!showDetails)}
                    >
                        {showDetails ? "Hide Detailed Prices" : "Show Detailed Prices"}
                    </button>
                </div>
                {loading && <p>Loading data...</p>}
                {error && <p>Error: {error}</p>}
                
                {!loading && !error && items.length > 0 && (
                    <div className={styles.list}>
                        {sortedItems.map((item, index) => (
                            <Card 
                                key={item.slug || index} 
                                item={item} 
                                category={category} 
                                showDetails={showDetails} 
                            />
                        ))}
                    </div>
                )}
                {!loading && !error && items.length === 0 && (
                    <p>No items found for {category}.</p>
                )}
            </section>
        </div>
    );
}