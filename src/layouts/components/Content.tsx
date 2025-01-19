import {Route, Routes} from "react-router-dom";
import Dashboard from "../../pages/Dashboard.tsx";
import Penghuni from "../../pages/penghuni/Penghuni.tsx";
import PenghuniForm from "../../pages/penghuni/PenghuniForm.tsx";
import Rumah from "../../pages/rumah/Rumah.tsx";
import RumahForm from "../../pages/rumah/RumahForm.tsx";
import ItemTransaksi from "../../pages/item_transaksi/ItemTransaksi.tsx";
import TransaksiIuran from "../../pages/transaksi/iuran/TransaksiIuran.tsx";
import TransaksiPengeluaran from "../../pages/transaksi/pengeluaran/TransaksiPengeluaran.tsx";
import Laporan from "../../pages/Laporan.tsx";
import ItemTransaksiForm from "../../pages/item_transaksi/ItemTransaksiForm.tsx";
import TransaksiIuranForm from "../../pages/transaksi/iuran/TransaksiIuranForm.tsx";
import TransaksiPengeluaranForm from "../../pages/transaksi/pengeluaran/TransaksiPengeluaranForm.tsx";

export default function Content() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard></Dashboard>}></Route>
            <Route path="/penghuni" element={<Penghuni></Penghuni>}></Route>
            <Route path="/penghuni/form" element={<PenghuniForm></PenghuniForm>}></Route>
            <Route path="/penghuni/form/:id" element={<PenghuniForm></PenghuniForm>}></Route>

            <Route path="/rumah" element={<Rumah></Rumah>}></Route>
            <Route path="/rumah/form" element={<RumahForm></RumahForm>}></Route>
            <Route path="/rumah/form/:id" element={<RumahForm></RumahForm>}></Route>

            <Route path="/item-transaksi" element={<ItemTransaksi></ItemTransaksi>}></Route>
            <Route path="/item-transaksi/form" element={<ItemTransaksiForm></ItemTransaksiForm>}></Route>
            <Route path="/item-transaksi/form/:id" element={<ItemTransaksiForm></ItemTransaksiForm>}></Route>


            <Route path="/transaksi/iuran" element={<TransaksiIuran></TransaksiIuran>}></Route>
            <Route path="/transaksi/iuran/form/:id" element={<TransaksiIuranForm></TransaksiIuranForm>}></Route>

            <Route path="/transaksi/pengeluaran" element={<TransaksiPengeluaran></TransaksiPengeluaran>}></Route>
            <Route path="/transaksi/pengeluaran/form" element={<TransaksiPengeluaranForm></TransaksiPengeluaranForm>}></Route>
            <Route path="/laporan" element={<Laporan></Laporan>}></Route>
        </Routes>
    );
}