import React, { useEffect, useState } from 'react'
import { getThongKeDoTuoi } from '../../services/ThongKeService';
import PieChart from '../charts/PieChart';

const ThongKeDoTuoi = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        getThongKeDoTuoi()
            .then(res => setData(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
      <PieChart data={data} />
    )
} 

export default ThongKeDoTuoi