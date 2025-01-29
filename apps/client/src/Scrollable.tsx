import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

interface Pockemon {
  name: string
  url: string
}

const LIMIT = 20;

function App() {
  const [pockemons, setPockemons] = useState<Pockemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const isFetching = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);


  const loadMorePosts = async () => {
    if (loading || isFetching.current) return;

    isFetching.current = true;
    setLoading(true);

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${(page - 1) * LIMIT}&limit=${LIMIT}`);
      const data = await response.json();
      setPockemons(prevPockemons => [...prevPockemons, ...data.results]);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  useEffect(() => {
    loadMorePosts();
  }, [page]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container || loading) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setPage((prevPage) => prevPage + 1); // Завантаження наступної сторінки
    }
  };

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      container.addEventListener('scroll', handleScroll);

      return () => {
        container.removeEventListener('scroll', handleScroll); // Очищення слухача
      };
    }
  }, [loading]);


  return (
    <div className='flex flex-col w-full h-full justify-center items-center flex-1'>
      <h1 className=' font-bold text-3xl m-4'>Infinity Scroll</h1>
      <div className="scrollable border-2 border-indigo-700 h-[600px] w-2/4 rounded-lg m-4 overflow-y-auto" ref={containerRef}>
        {pockemons.map((pockemon: Pockemon, index: number) => (
          <div key={index} className='flex items-center justify-between p-4 border-b-2 border-indigo-700'>
            <p>{pockemon.name}</p>
            <img src={reactLogo} alt="React Logo" className='w-8 h-8' />
          </div>
        ))}
      </div>

      <button onClick={() => setPage(page + 1)} disabled={loading}>
        Load More
      </button>
    </div>
  )
}

export default App
