import * as React from "react";
import {useEffect, useState} from "react";
import apiClient from "../../services/apiServices.ts";
import {PenghuniProps, PenghuniRumahProps} from "../../types/type.ts";

interface PenghuniRumahParam {
    id: string;
}

export default function PenghuniRumah({id}: PenghuniRumahParam) {

    const [loadingForm, setLoadingForm] = useState(false);

    const [penghuni, setPenghuni] = useState<PenghuniProps[]>([]);
    const [selectedPenghuniId, setSelectedPenghuniId] = useState<string>("");

    const [penghuniRumah, setPenghuniRumah] = useState<PenghuniRumahProps[]>([]);

    const fetchPenghuniRumah = (id: string) => {
        apiClient
            .get(`/penghuni-rumah?by=rumah&id=${id}`)
            .then(response => {
                setPenghuniRumah(response.data.data.penghuni_rumah);
            })
            .catch(error => {
                console.error(error);
            });
    }

    useEffect(() => {
        apiClient
            .get(`/penghuni`)
            .then(response => {
                setPenghuni(response.data.data);
            })
            .catch(error => {
                console.error(error);
            });
    },[]);

    useEffect(() => {
        fetchPenghuniRumah(id)
    },[id]);

    const handleSubmitPenghuniRumah = async (e: React.FormEvent) => {
        e.preventDefault();

        const submitFormElement = document.getElementById("submitForm");
        const submissionData = new FormData(submitFormElement as HTMLFormElement);
        submissionData.append("penghuni_id", selectedPenghuniId);
        submissionData.append("rumah_id", id);

        try {
            setLoadingForm(true)
            const response = await apiClient.post(
                    "/penghuni-rumah/store",
                    submissionData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        }
                    }
                )
            if(response.status === 200) {
                setLoadingForm(false)
                alert(`Penghuni Rumah store successful!`);
                fetchPenghuniRumah(id)
            }else{
                setLoadingForm(false)
                alert(`Penghuni Rumah store failed!`);
                console.error(response.data.message)
            }
        }catch (e) {
            setLoadingForm(false)
            alert(`Penghuni Rumah store error!`);
            console.error(e)
        }
    }

    const handleDeletePenghuniRumah = (id: string) => {
        if (confirm(`Apakah kamu yakin ingin menghapus data dengan ID ${id}?`)) {
            apiClient.delete(`/penghuni-rumah/delete/${id}`)
                .then(() => {
                    setPenghuniRumah(penghuniRumah.filter(item => item.id !== id));
                    alert("Data berhasil dihapus!");
                })
                .catch(err => {
                    alert("Gagal menghapus data")
                    console.error(err)
                });
        }
    }

    return (
        <>
            <div className="content-header">
                <div className="title">
                    <h3>Form Penghuni Rumah</h3>
                </div>
            </div>
            <div className="content-body">
                <form onSubmit={handleSubmitPenghuniRumah} id={"submitFormPenghuniRumah"} encType={"multipart/form-data"}>
                    <div className="form-group">
                        <label htmlFor="penghuni_id">Penghuni</label>
                        <select
                            name={"penghuni_id"}
                            id={"penghuni_id"}
                            className={"form-control"}
                            value={selectedPenghuniId}
                            onChange={(e) => setSelectedPenghuniId(e.target.value)}
                        >
                            <option value="">.:: Pilih Penghuni ::.</option>
                            {penghuni.map((data, index) => (
                                <option key={index} value={data.id}>{data.nama_lengkap}</option>
                            ))}
                        </select>
                    </div>
                    <button type={"submit"} style={{cursor: "pointer"}}
                            form={"submitFormPenghuniRumah"}>{(!loadingForm) ? 'Simpan' : 'Loading'}</button>
                </form>
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama</th>
                        <th>Aksi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {penghuniRumah.map((data, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{data.penghuni.nama_lengkap}</td>
                            <td>
                                <span style={{
                                    cursor: "pointer"
                                }} onClick={() => handleDeletePenghuniRumah(data.id)}>delete</span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}