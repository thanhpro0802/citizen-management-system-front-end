import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material'
import { Route, Routes } from 'react-router-dom';
import Topbar from './pages/global/Topbar';
import Sidebar from './pages/global/Sidebar';
import TrangChu from './pages/TrangChu';
import ThongKe from './thong-ke';

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <div className='app'>
          {/* Sidebar */}
          <Sidebar />

          <main className='content'>
            {/* Topbar */}
            <Topbar />

            {/* Routes */}
            <Routes>
              <Route path='/' element={<TrangChu />} />
              <Route path='/thong-ke' element={<ThongKe />} />

            </Routes>
          </main>
        </div>

      </ThemeProvider>
    </ColorModeContext.Provider>
    
  )
}

export default App;
