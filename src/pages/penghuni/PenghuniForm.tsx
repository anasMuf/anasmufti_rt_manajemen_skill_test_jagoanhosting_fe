import MainPage from "../components/MainPage.tsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import "../components/css/form.css"
import * as React from "react";
import {useEffect, useState} from "react";
import apiClient from "../../services/apiServices.ts";
import {PenghuniProps} from "../../types/type.ts";
import {STORAGE_URL} from "../../services/storageServices.ts";

export default function PenghuniForm() {
    const { id } = useParams<{ id: string }>();

    const [loadingForm, setLoadingForm] = useState(false);

    const [selectedSudahMenikah, setSelectedSudahMenikah] = useState(false);

    const [penghuni, setPenghuni] = useState<PenghuniProps>({
        id: "",
        nama_lengkap: "",
        foto_ktp: "",
        gender: "",
        status_penghuni: "",
        sudah_menikah: false
    })

    useEffect(() => {
        if(id){
            apiClient
                .get(`/penghuni/${id}`)
                .then(response => {
                    const data = response.data.data;

                    setPenghuni({
                        ...data,
                        sudah_menikah: data.sudah_menikah === 1 // Ubah menjadi boolean
                    });
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
                "/penghuni/store",
                submissionData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }
            )
            : await apiClient.post(
                    `/penghuni/update/${id}`,
                    submissionData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        }
                    }
                );
            if(response.status === 200) {
                setLoadingForm(false)
                alert(`Penghuni ${!id?'store':'update'} successful!`);
                navigate("/penghuni/");
            }else{
                setLoadingForm(false)
                alert(`Penghuni ${!id?'store':'update'} failed!`);
                console.error(response.data.message)
            }
        }catch (e) {
            setLoadingForm(false)
            alert(`Penghuni ${!id?'store':'update'} error!`);
            console.error(e)
        }
    }

    return (
        <MainPage menu={'page-penghuni'}>
            <div className="content-header">
                <div className="title">
                    <h3>Form Penghuni</h3>
                </div>
                <div className="aksi">
                    <Link to={{
                        pathname: `/penghuni`,
                    }}>Kembali</Link> |
                     <button type={"submit"} style={{cursor:"pointer"}} form={"submitForm"}>{(!loadingForm)?'Simpan':'Loading'}</button>
                </div>
            </div>
            <div className="content-body">
                <form onSubmit={handleSubmit} id={"submitForm"} encType={"multipart/form-data"}>
                    {(id) ? <input type={"hidden"} name={"id"} value={id}/> : ''}
                    <div className="form-group">
                        <label htmlFor="nama_lengkap">Nama Lengkap</label>
                        <input
                            type={"text"}
                            name={"nama_lengkap"}
                            id={"nama_lengkap"}
                            className={"form-control"}
                            placeholder={"Masukkan Nama Lengkap"}
                            value={penghuni.nama_lengkap || ""}
                            onChange={(e) => setPenghuni({...penghuni, nama_lengkap: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="gender">Jenis Kelamin</label>
                        <label htmlFor={"genderL"}>
                            <input
                                type={"radio"}
                                name={"gender"}
                                id={"genderL"}
                                value={"L"}
                                checked={penghuni.gender === "L"}
                                onChange={(e) => setPenghuni({...penghuni, gender: e.target.value})}
                            />
                            Laki-laki
                        </label>
                        <label htmlFor={"genderP"}>
                            <input
                                type={"radio"}
                                name={"gender"}
                                id={"genderP"}
                                value={"P"}
                                checked={penghuni.gender === "P"}
                                onChange={(e) => setPenghuni({...penghuni, gender: e.target.value})}
                            />
                            Perempuan
                        </label>
                    </div>
                    <div className="form-group">
                        <label htmlFor="status_penghuni">Staus Penghuni</label>
                        <label htmlFor={"status_penghuni_kontrak"}>
                            <input
                                type={"radio"}
                                name={"status_penghuni"}
                                id={"status_penghuni_kontrak"}
                                value={"kontrak"}
                                checked={penghuni.status_penghuni === "kontrak"}
                                onChange={(e) => setPenghuni({...penghuni, status_penghuni: e.target.value})}
                            />
                            Kontrak
                        </label>
                        <label htmlFor={"status_penghuni_tetap"}>
                            <input
                                type={"radio"}
                                name={"status_penghuni"}
                                id={"status_penghuni_tetap"}
                                value={"tetap"}
                                checked={penghuni.status_penghuni === "tetap"}
                                onChange={(e) => setPenghuni({...penghuni, status_penghuni: e.target.value})}
                            />
                            Tetap
                        </label>
                    </div>
                    <div className="form-group">
                        <label htmlFor="sudah_menikah">Sudah Menikah</label>

                        <select
                            name={"sudah_menikah"}
                            id={"sudah_menikah"}
                            className={"form-control"}
                            value={selectedSudahMenikah}
                            onChange={(e) => setSelectedSudahMenikah(e.target.value === "true")}
                        >
                            <option value={true}>Sudah Menikah</option>
                            <option value={false}>Belum Menikah</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="foto_ktp">Upload Foto KTP</label>
                        <input
                            type={"file"}
                            name={"foto_ktp"}
                            id={"foto_ktp"}
                            className={"form-control"}
                            accept="image/*"

                        />
                    </div>
                    {id && penghuni.foto_ktp
                        ? <div className="form-group">
                            <label htmlFor="preview_foto_ktp">Preview Foto KTP</label>
                            <img src={`${STORAGE_URL}/${penghuni.foto_ktp}`} width={200}/>
                        </div>
                        : ''}
                </form>
            </div>
        </MainPage>
    );
}