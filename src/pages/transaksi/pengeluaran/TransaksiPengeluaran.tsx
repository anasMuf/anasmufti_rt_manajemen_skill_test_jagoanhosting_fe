import MainPage from "../../components/MainPage.tsx";
import "../../components/css/table.css";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {TransaksiProps} from "../../../types/type.ts";
import apiClient from "../../../services/apiServices.ts";
import TableMaster from "../../components/TableMaster.tsx";

export default function TransaksiPengeluaran() {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [transaksiPengeluaran, setTransaksiPengeluaran] = useState<TransaksiProps[]>([]);

    useEffect(() => {
        apiClient
            .get('/transaksi/pengeluaran/data')
            .then(response => {
                setLoading(false);
                setTransaksiPengeluaran(response.data.data)
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
                    setTransaksiPengeluaran(transaksiPengeluaran.filter(item => item.id !== id));
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
        <MainPage menu={"page-transaksi_pengeluaran"}>
            <TableMaster
                title={"Transaksi Pengeluaran"}
                basePath={"transaksi/pengeluaran"}
                columns={
                    <tr>
                        <td>No</td>
                        <td>Tgl</td>
                        {/*<th>Item Transaksi</th>*/}
                        <th>Nominal</th>
                        <th>Aksi</th>
                    </tr>
                }
                datas={
                    transaksiPengeluaran.map((data,index) => (
                        <tr key={data.id}>
                            <td>{index+1}</td>
                            <td>{data.tgl_transaksi}</td>
                            {/*<td>{data.transaksi_detail.map(item => {*/}
                            {/*    return (*/}
                            {/*        <>*/}
                            {/*            {item.item_transaksi.nama_item}*/}
                            {/*        </>*/}
                            {/*    );*/}
                            {/*})}</td>*/}
                            <td>{data.kredit}</td>
                            <td>
                                <Link to={{
                                    pathname: `/transaksi/pengeluaran/${data.id}`,
                                }}>lihat</Link> |
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