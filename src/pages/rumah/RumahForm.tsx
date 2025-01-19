import MainPage from "../components/MainPage.tsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import "../components/css/form.css"
import * as React from "react";
import {useEffect, useState} from "react";
import apiClient from "../../services/apiServices.ts";
import {PenghuniProps, PenghuniRumahProps, RumahProps} from "../../types/type.ts";
import {STORAGE_URL} from "../../services/storageServices.ts";
import PenghuniRumah from "../penghuni_rumah/PenghuniRumah.tsx";

export default function RumahForm() {
    const { id } = useParams<{ id: string }>();

    const [loadingForm, setLoadingForm] = useState(false);

    const [rumah, setRumah] = useState<RumahProps>({
        id: "",
        no_rumah: "",
        foto_rumah: "",
        status_penghuni: "",
    });

    useEffect(() => {
        if(id){
            apiClient
                .get(`/rumah/${id}`)
                .then(response => {
                    setRumah(response.data.data)
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
                "/rumah/store",
                submissionData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }
            )
            : await apiClient.post(
                    `/rumah/update/${id}`,
                    submissionData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        }
                    }
                );
            if(response.status === 200) {
                setLoadingForm(false)
                alert(`Rumah ${!id?'store':'update'} successful!`);
                navigate("/rumah/");
            }else{
                setLoadingForm(false)
                alert(`Rumah ${!id?'store':'update'} failed!`);
                console.error(response.data.message)
            }
        }catch (e) {
            setLoadingForm(false)
            alert(`Rumah ${!id?'store':'update'} error!`);
            console.error(e)
        }
    }

    return (
        <MainPage menu={'page-rumah'}>
            <div className="content-header">
                <div className="title">
                    <h3>Form Rumah</h3>
                </div>
                <div className="aksi">
                    <Link to={{
                        pathname: `/rumah`,
                    }}>Kembali</Link> |
                    <button type={"submit"} style={{cursor:"pointer"}} form={"submitForm"}>{(!loadingForm)?'Simpan':'Loading'}</button>
                </div>
            </div>
            <div className="content-body">
                <form onSubmit={handleSubmit} id={"submitForm"} encType={"multipart/form-data"}>
                    {(id) ? <input type={"hidden"} name={"id"} value={id}/> : ''}
                    <div className="form-group">
                        <label htmlFor="no_rumah">No Rumah</label>
                        <input
                            type={"text"}
                            name={"no_rumah"}
                            id={"no_rumah"}
                            className={"form-control"}
                            placeholder={"Masukkan No Rumah"}
                            value={rumah.no_rumah || ""}
                            onChange={(e) => setRumah({...rumah, no_rumah: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="status_penghuni">Staus Penghuni</label>
                        <label htmlFor={"status_penghuni_dihuni"}>
                            <input
                                type={"radio"}
                                name={"status_penghuni"}
                                id={"status_penghuni_dihuni"}
                                value={"dihuni"}
                                checked={rumah.status_penghuni === "dihuni"}
                                onChange={(e) => setRumah({...rumah, status_penghuni: e.target.value})}
                            />
                            Dihuni
                        </label>
                        <label htmlFor={"status_penghuni_tidak_dihuni"}>
                            <input
                                type={"radio"}
                                name={"status_penghuni"}
                                id={"status_penghuni_tidak_dihuni"}
                                value={"tidak dihuni"}
                                checked={rumah.status_penghuni === "tidak dihuni"}
                                onChange={(e) => setRumah({...rumah, status_penghuni: e.target.value})}
                            />
                            Tidak dihuni
                        </label>
                    </div>
                    <div className="form-group">
                        <label htmlFor="foto_rumah">Upload Foto Rumah</label>
                        <input
                            type={"file"}
                            name={"foto_rumah"}
                            id={"foto_rumah"}
                            className={"form-control"}
                            accept="image/*"

                        />
                    </div>
                    {id && rumah.foto_rumah
                        ? <div className="form-group">
                            <label htmlFor="preview_foto_rumah">Preview Foto Rumah</label>
                            <img src={`${STORAGE_URL}/${rumah.foto_rumah}`} width={200}/>
                        </div>
                        : ''}
                </form>

            </div>

            {(id)
            ?
                <PenghuniRumah id={id}/>
                : ''}
        </MainPage>
    );
}