import MainPage from "../components/MainPage.tsx";
import "../components/css/table.css";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {ItemTransaksiProps} from "../../types/type.ts";
import apiClient from "../../services/apiServices.ts";
import TableMaster from "../components/TableMaster.tsx";
import {formatCurrency} from "../../services/Helpers.ts";

export default function ItemTransaksi() {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [dataItemTransaksi, setDataItemTransaksi] = useState<ItemTransaksiProps[]>([]);

    useEffect(() => {
        apiClient
            .get('/item-transaksi')
            .then(response => {
                setLoading(false);
                setDataItemTransaksi(response.data.data)
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

    const handleDelete = (id: string) => {
        if (confirm(`Apakah kamu yakin ingin menghapus data dengan ID ${id}?`)) {
            apiClient.delete(`/item-transaksi/delete/${id}`)
                .then(() => {
                    setDataItemTransaksi(dataItemTransaksi.filter(item => item.id !== id));
                    alert("Data berhasil dihapus!");
                })
                .catch(err => {
                    alert("Gagal menghapus data")
                    console.error(err)
                });
        }
    }


    if (loading) {
        return <p>Loading data item-transaksi...</p>;
    }

    if (error) {
        return <p>Error loading data: {error}</p>;
    }

    return (
        <MainPage menu={"page-item-transaksi"}>
            <TableMaster
                title={"ItemTransaksi"}
                basePath={"item-transaksi"}
                columns={
                    <tr>
                        <td>No</td>
                        <td>Nama Item</td>
                        <th>Tipe</th>
                        <th>Sifat</th>
                        <th>Nominal</th>
                        <th>Aksi</th>
                    </tr>
                }
                datas={
                    dataItemTransaksi.map((data,index) => (
                        <tr key={data.id}>
                            <td>{index+1}</td>
                            <td>{data.nama_item}</td>
                            <td>{data.tipe === 'in' ? 'pemasukani' : 'pengeluaran'}</td>
                            <td>{data.wajib?'wajib':'tidak wajib'}</td>
                            <td style={{textAlign:"end"}}>{formatCurrency(data.nominal)}</td>
                            <td>
                                <Link to={{
                                    pathname: `/item-transaksi/form/${data.id}`,
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