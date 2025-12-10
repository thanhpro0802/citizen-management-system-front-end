import React, { useEffect, useState } from 'react'
import { getThongKeGioiTinh } from '../../services/ThongKeService';
import PieChart from '../charts/PieChart';

const ThongKeGioiTinh = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        getThongKeGioiTinh()
            .then(res => setData(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
      <PieChart data={data} />
    )
} 

export default ThongKeGioiTinh