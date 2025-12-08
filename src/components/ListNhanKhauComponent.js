import React, {useState, useEffect} from 'react'
import { getListNhanKhau } from '../services/ListNhanKhauService'

const NhanKhauComponent = () => {

    const [nhanKhau, setNhanKhau] = useState([])

    useEffect(() => {
        getListNhanKhau()
            .then((res) => {
                setNhanKhau(res.data)
            })
            .catch(error => {
                console.error(error)
            })
    }, [])    

  return (
    <div className='container'>
        
        <h2>Danh sach Nhan khau</h2>
        <table className='table table-striped table-bordered'>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>HoTen</th>
                    <th>GioiTinh</th>
                </tr>
            </thead>
            <tbody>
                {
                    nhanKhau.map(nhanKhau =>
                        <tr key={nhanKhau.id}>
                            <td>{nhanKhau.id}</td>
                            <td>{nhanKhau.hoTen}</td>
                            <td>{nhanKhau.gioiTinh}</td>
                        </tr>
                    )
                }
            </tbody>
        </table>

    </div>
  )
}

export default NhanKhauComponent