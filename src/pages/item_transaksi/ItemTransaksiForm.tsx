import MainPage from "../components/MainPage.tsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import "../components/css/form.css"
import * as React from "react";
import {useEffect, useState} from "react";
import apiClient from "../../services/apiServices.ts";
import {ItemTransaksiProps} from "../../types/type.ts";

export default function ItemTransaksiForm() {
    const { id } = useParams<{ id: string }>();

    const [loadingForm, setLoadingForm] = useState(false);

    const [selectedWajib, setSelectedWajib] = useState(false);

    const [itemTransaksi, setItemTransaksi] = useState<ItemTransaksiProps>({
        id: "",
        nama_item: "",
        tipe: "",
        wajib: false,
        nominal: 0,
    })

    useEffect(() => {
        if(id){
            apiClient
                .get(`/item-transaksi/${id}`)
                .then(response => {
                    const data = response.data.data;

                    setItemTransaksi(data);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    },[id])


    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const submitFormElement = document.getElementById("submitForm");
        const submissionData = new FormData(submitFormElement as HTMLFormElement);

        try {
            setLoadingForm(true)
            const response = (!id)
                ? await apiClient.post(
                    "/item-transaksi/store",
                    submissionData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        }
                    }
                )
                : await apiClient.post(
                    `/item-transaksi/update/${id}`,
                    submissionData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        }
                    }
                );
            if(response.status === 200) {
                setLoadingForm(false)
                alert(`Item Transaksi ${!id?'store':'update'} successful!`);
                navigate("/item-transaksi/");
            }else{
                setLoadingForm(false)
                alert(`Item Transaksi ${!id?'store':'update'} failed!`);
                console.error(response.data.message)
            }
        }catch (e) {
            setLoadingForm(false)
            alert(`Item Transaksi ${!id?'store':'update'} error!`);
            console.error(e)
        }
    }

    return (
        <MainPage menu={'page-item-transaksi'}>
            <div className="content-header">
                <div className="title">
                    <h3>Form Item Transaksi</h3>
                </div>
                <div className="aksi">
                    <Link to={{
                        pathname: `/item-transaksi`,
                    }}>Kembali</Link> |
                    <button type={"submit"} style={{cursor:"pointer"}} form={"submitForm"}>{(!loadingForm)?'Simpan':'Loading'}</button>
                </div>
            </div>
            <div className="content-body">
                <form onSubmit={handleSubmit} id={"submitForm"} encType={"multipart/form-data"}>
                    {(id) ? <input type={"hidden"} name={"id"} value={id}/> : ''}
                    <div className="form-group">
                        <label htmlFor="nama_item">Nama Item</label>
                        <input
                            type={"text"}
                            name={"nama_item"}
                            id={"nama_item"}
                            className={"form-control"}
                            placeholder={"Masukkan Nama Item"}
                            value={itemTransaksi.nama_item || ""}
                            onChange={(e) => setItemTransaksi({...itemTransaksi, nama_item: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="tipe">Tipe</label>
                        <label htmlFor={"tipeIn"}>
                            <input
                                type={"radio"}
                                name={"tipe"}
                                id={"tipeIn"}
                                value={"in"}
                                checked={itemTransaksi.tipe === "in"}
                                onChange={(e) => setItemTransaksi({...itemTransaksi, tipe: e.target.value})}
                            />
                            Pemasukan
                        </label>
                        <label htmlFor={"tipeOut"}>
                            <input
                                type={"radio"}
                                name={"tipe"}
                                id={"tipeOut"}
                                value={"out"}
                                checked={itemTransaksi.tipe === "out"}
                                onChange={(e) => setItemTransaksi({...itemTransaksi, tipe: e.target.value})}
                            />
                            Pengeluaran
                        </label>
                    </div>
                    <div className="form-group">
                        <label htmlFor="wajib">Wajib</label>
                        <select
                            name={"wajib"}
                            id={"wajib"}
                            className={"form-control"}
                            value={selectedWajib}
                            onChange={(e) => setSelectedWajib(e.target.value === "true")}
                        >
                            <option value={"true"}>Wajib</option>
                            <option value={"false"}>Tidak Wajib</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="nominal">Nominal</label>
                        <input
                            type={"text"}
                            name={"nominal"}
                            id={"nominal"}
                            className={"form-control"}
                            placeholder={"Masukkan Nominal"}
                            value={itemTransaksi.nominal || ""}
                            onChange={(e) => setItemTransaksi({...itemTransaksi, nominal: e.target.value})}
                        />
                    </div>
                </form>
            </div>
        </MainPage>
    );
}