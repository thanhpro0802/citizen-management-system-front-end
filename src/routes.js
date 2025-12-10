import TrangChu from './pages/TrangChu';
import ThongKe from './pages/ThongKe';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';

const routes = [
    {
        path: '/',
        name: 'TrangChu',
        icon: <DashboardIcon />,
        component: TrangChu
    },
    {
        path: '/thong-ke',
        name: 'ThongKe',
        icon: <BarChartIcon />,
        component: ThongKe
    }
];

export default routes;