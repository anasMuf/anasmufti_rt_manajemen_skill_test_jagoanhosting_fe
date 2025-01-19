import MainPage from "../../components/MainPage.tsx";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../../components/css/form.css";
import * as React from "react";
import { useEffect, useState } from "react";
import apiClient from "../../../services/apiServices.ts";
import { ItemTransaksiProps, TransaksiDetailProps, TransaksiProps } from "../../../types/type.ts";
import {formatCurrency} from "../../../services/Helpers.ts";

export default function TransaksiPengeluaranForm() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [loadingForm, setLoadingForm] = useState(false);
    const [itemTransaksi, setItemTransaksi] = useState<ItemTransaksiProps[]>([]);
    const [transaksi, setTransaksi] = useState<TransaksiProps>({
        id: "",
        tipe: "out",
        deskripsi: "",
        tgl_transaksi: "",
        debit: 0,
        kredit: 0,
    });
    const [items, setItems] = useState<{ item_transaksi_id: number; qty: number }[]>([]);
    const [tglTransaksi, setTglTransaksi] = useState<string>("");

    useEffect(() => {
        apiClient
            .get(`/item-transaksi/out`)
            .then((response) => {
                setItemTransaksi(response.data.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [id]);

    const handleAddItem = () => {
        setItems((prevItems) => [
            ...prevItems,
            { item_transaksi_id: 0, qty: 1 }, // Default item and qty
        ]);
    };

    const handleItemChange = (
        index: number,
        field: "item_transaksi_id" | "qty",
        value: any
    ) => {
        const updatedItems = [...items];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setItems(updatedItems);
    };

    const handleDeleteItem = (index: number) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
    };

    const handleTglTransaksiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTglTransaksi(e.target.value); // Update tgl_transaksi state
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let total = 0;
        const itemTransaksiIds: string[] = [];
        items.forEach((item) => {
            const foundItem = itemTransaksi.find((i) => i.id === item.item_transaksi_id);
            if (foundItem) {
                total += foundItem.nominal * item.qty;
                for (let i = 0; i < item.qty; i++) {
                    itemTransaksiIds.push(foundItem.id.toString());
                }
            }
        });

        const submissionData = {
            tipe: "out",
            deskripsi: transaksi.deskripsi || null,
            tgl_transaksi: tglTransaksi, // Use tglTransaksi from state
            total: total,
            item_transaksi_id: itemTransaksiIds,
        };

        try {
            setLoadingForm(true);
            const response = await apiClient.post("/transaksi/pengeluaran/store", submissionData);
            if (response.status === 200) {
                setLoadingForm(false);
                alert(`Transaksi store successful!`);
                navigate("/transaksi/pengeluaran");
            } else {
                setLoadingForm(false);
                alert(`Transaksi store failed!`);
                console.error(response.data.message);
            }
        } catch (e) {
            setLoadingForm(false);
            alert(`Transaksi store error!`);
            console.error(e);
        }
    };

    return (
        <MainPage menu={"page-transaksi-pengeluaran"}>
            <div className="content-header">
                <div className="title">
                    <h3>Form Transaksi Pengeluaran</h3>
                </div>
                <div className="aksi">
                    <Link to={"/transaksi/pengeluaran"}>Kembali</Link> |{" "}
                    <button type="submit" style={{ cursor: "pointer" }} form="submitForm">
                        {!loadingForm ? "Simpan" : "Loading"}
                    </button>
                </div>
            </div>
            <div className="content-body">
                <form onSubmit={handleSubmit} id="submitForm">
                    <div className="form-group">
                        <label htmlFor="tgl_transaksi">Tgl Transaksi</label>
                        <input
                            type="date"
                            name="tgl_transaksi"
                            id="tgl_transaksi"
                            className="form-control"
                            value={tglTransaksi} // Bind the state value
                            onChange={handleTglTransaksiChange} // Handle the change event
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nama_lengkap">Item Transaksi</label>
                        <table>
                            <thead>
                            <tr>
                                <th>Item</th>
                                <th style={{ width: "10%" }}>Qty</th>
                                <th>Subtotal</th>
                                <th>
                                    <button type="button" onClick={handleAddItem}>
                                        tambah
                                    </button>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <select
                                            className={"form-control w-100"}
                                            name={`item_transaksi_id[${index}]`}
                                            value={item.item_transaksi_id}
                                            onChange={(e) =>
                                                handleItemChange(index, "item_transaksi_id", parseInt(e.target.value))
                                            }
                                        >
                                            <option value={0}>Pilih Item</option>
                                            {itemTransaksi.map((itemOption) => (
                                                <option key={itemOption.id} value={itemOption.id}>
                                                    {itemOption.nama_item}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            className="form-control"
                                            type="number"
                                            name={`qty[${index}]`}
                                            value={item.qty}
                                            onChange={(e) =>
                                                handleItemChange(index, "qty", parseInt(e.target.value))
                                            }
                                            min={1}
                                        />
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        {item.item_transaksi_id
                                            ? formatCurrency(
                                                itemTransaksi.find((i) => i.id === item.item_transaksi_id)?.nominal! *
                                                item.qty
                                            )
                                            : "0"}
                                    </td>
                                    <td>
                                        <span
                                            style={{ cursor: "pointer", color: "red" }}
                                            onClick={() => handleDeleteItem(index)}
                                        >
                                            delete
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </form>
            </div>
        </MainPage>
    );
}

