import MainPage from "../components/MainPage.tsx";
import "../components/css/table.css";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {RumahProps} from "../../types/type.ts";
import apiClient from "../../services/apiServices.ts";
import TableMaster from "../components/TableMaster.tsx";

export default function Rumah() {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [dataRumah, setDataRumah] = useState<RumahProps[]>([]);

    useEffect(() => {
        apiClient
            .get('/rumah')
            .then(response => {
                setLoading(false);
                setDataRumah(response.data.data)
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
                    setDataRumah(dataRumah.filter(item => item.id !== id));
                    alert("Data berhasil dihapus!");
                })
                .catch(err => {
                    alert("Gagal menghapus data")
                    console.error(err)
                });
        }
    }


    if (loading) {
        return <p>Loading data rumah...</p>;
    }

    if (error) {
        return <p>Error loading data: {error}</p>;
    }

    return (
        <MainPage menu={"page-rumah"}>
            <TableMaster
                title={"Rumah"}
                basePath={"rumah"}
                columns={
                    <tr>
                        <td>No</td>
                        <td>Nomor Rumah</td>
                        <th>Status Penghuni</th>
                        <th>Foto Rumah</th>
                        <th>Aksi</th>
                    </tr>
                }
                datas={
                    dataRumah.map((data,index) => (
                        <tr key={data.id}>
                            <td>{index+1}</td>
                            <td>{data.no_rumah}</td>
                            <td>{data.status_penghuni}</td>
                            <td>{data.foto_rumah?'ter upload':'belum ter upload'}</td>
                            <td>
                                <Link to={{
                                    pathname: `/rumah/form/${data.id}`,
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