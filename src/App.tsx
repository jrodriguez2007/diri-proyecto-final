import { AppRouter } from '@/router/AppRouter'
import { HomeLayout } from '@/modules/home/layout/HomeLayout'

import '@/App.css';

function App() {

  return (
      <HomeLayout>
        <AppRouter />
      </HomeLayout>    
  )
}

export default App
