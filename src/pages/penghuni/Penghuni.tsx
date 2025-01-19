import MainPage from "../components/MainPage.tsx";
import "../components/css/table.css";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {PenghuniProps} from "../../types/type.ts";
import apiClient from "../../services/apiServices.ts";
import TableMaster from "../components/TableMaster.tsx";

export default function Penghuni() {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [dataPenghuni, setDataPenghuni] = useState<PenghuniProps[]>([]);

    useEffect(() => {
        apiClient
            .get('/penghuni')
            .then(response => {
                setLoading(false);
                setDataPenghuni(response.data.data)
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

    const handleDelete = (id: string) => {
        if (confirm(`Apakah kamu yakin ingin menghapus data dengan ID ${id}?`)) {
            apiClient.delete(`/penghuni/delete/${id}`)
                .then(() => {
                    setDataPenghuni(dataPenghuni.filter(item => item.id !== id));
                    alert("Data berhasil dihapus!");
                })
                .catch(err => {
                    alert("Gagal menghapus data")
                    console.error(err)
                });
        }
    }


    if (loading) {
        return <p>Loading data penghuni...</p>;
    }

    if (error) {
        return <p>Error loading data: {error}</p>;
    }

    return (
        <MainPage menu={"page-penghuni"}>
            <TableMaster
                title={"Penghuni"}
                basePath={"penghuni"}
                columns={
                    <tr>
                        <td>No</td>
                        <td>Nama</td>
                        <th>Gender</th>
                        <th>Status Penghuni</th>
                        <th>Sudah Menikah</th>
                        <th>KTP</th>
                        <th>Aksi</th>
                    </tr>
                }
                datas={
                    dataPenghuni.map((data,index) => (
                        <tr key={data.id}>
                            <td>{index+1}</td>
                            <td>{data.nama_lengkap}</td>
                            <td>{data.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                            <td>{data.status_penghuni}</td>
                            <td>{data.sudah_menikah?'sudah menikah':'belum menikah'}</td>
                            <td>{data.foto_ktp?'ter upload':'belum ter upload'}</td>
                            <td>
                                <Link to={{
                                    pathname: `/penghuni/form/${data.id}`,
                                }}>edit</Link> |
                                <span style={{
                                    cursor: "pointer"
                                }} onClick={() => handleDelete(data.id)}> delete</span>
                            </td>
                        </tr>
                    ))
                }/>
        </MainPage>
    );
}