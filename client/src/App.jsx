import { useEffect, useState } from 'react'

function App() {
  const [status, setStatus] = useState('Loading...')

  useEffect(() => {
    fetch('/api/health')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setStatus(data.status))
      .catch((err) => {
        console.error('Error fetching health status:', err);
        setStatus('Error connecting to server');
      });
  }, [])

  return (
    <div>
      Server status: {status}
    </div>
  )
}

export default App
