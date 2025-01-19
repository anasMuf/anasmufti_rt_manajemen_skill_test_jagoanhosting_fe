import MainPage from "../../components/MainPage.tsx";
import "../../components/css/transaksi.css";
import {useEffect, useState} from "react";
import {
    ItemTransaksiProps,
    PenghuniRumahProps,
    RumahProps,
    TagihanProps,
    TagihanRumahProps
} from "../../../types/type.ts";
import apiClient from "../../../services/apiServices.ts";
import {useNavigate, useParams} from "react-router-dom";
import {formatCurrency} from "../../../services/Helpers.ts";

export default function TransaksiIuranForm() {
    const { id } = useParams<{ id: string }>();

    const [loadingForm, setLoadingForm] = useState(false);

    const [selectedValues, setSelectedValues] = useState<{ [itemId: number]: number[] }>({});
    const [total, setTotal] = useState<number>(0);

    const [rumah, setRumah] = useState<RumahProps[]>([]);
    const [penghuniRumah, setPenghuniRumah] = useState<PenghuniRumahProps[]>([]);
    const [tagihanRumah, setTagihanRumah] = useState<TagihanRumahProps[]>([]);
    const [itemIuran, setItemIuran] = useState<ItemTransaksiProps[]>([]);

    useEffect(() => {
        apiClient.get(`/rumah/tagihan/${id}`)
            .then(response => {
                setTagihanRumah(response.data.data.tagihan);
            })
            .catch(error => {
                console.error(error);
            })
    }, [id]);

    useEffect(() => {
        apiClient.get(`/transaksi/iuran`)
            .then(response => {
                setItemIuran(response.data.data)
            })
            .catch(error => {
                console.error(error);
            })
    }, [id]);

    const handleCheckboxChange = (
        itemId: number,
        tagihanId: number,
        isChecked: boolean
    ) => {
        setSelectedValues((prev) => {
            const itemValues = prev[itemId] || [];
            const updatedValues = isChecked
                ? [...itemValues, tagihanId].sort((a, b) => a - b)
                : itemValues.filter((id) => id !== tagihanId);

            const newSelectedValues = {
                ...prev,
                [itemId]: updatedValues,
            };
            calculateTotal(newSelectedValues);

            return newSelectedValues;
        });
    };

    const calculateTotal = (selectedValues: { [itemId: number]: number[] }) => {
        let newTotal = 0;
        itemIuran.forEach((item) => {
            const count = selectedValues[item.id]?.length || 0;
            newTotal += count * item.nominal;
        });
        setTotal(newTotal);
    };

    const navigate = useNavigate();

    const handleSubmit = async (e): Promise<void> => {
        e.preventDefault();

        const today = new Date();
        const formattedDate = today.toISOString().split("T")[0];

        const submissionData = {
            rumah_id: parseInt(id),
            tipe: "in",
            tgl_transaksi: formattedDate,
            total: total,
            item_transaksi: Object.entries(selectedValues).map(([itemId, tagihanIds]) => ({
                item_transaksi_id: parseInt(itemId),
                tagihan_id: tagihanIds,
            })),
        };

        try{
            const response = await apiClient.post(`/transaksi/iuran/store`, submissionData)
            if(response.status === 200) {
                setLoadingForm(false)
                alert(`Tagihan Rumah store successful!`);
                navigate("/transaksi/iuran");
            }else{
                setLoadingForm(false)
                alert(`Tagihan Rumah store failed!`);
                console.error(response.data.message)
            }
        }catch (e) {
            setLoadingForm(false)
            alert(`Tagihan Rumah store error!`);
            console.error(e)
        }
    }

    return (
        <MainPage menu={"page-transaksi-iuran"}>
            <form onSubmit={handleSubmit} id={"submitForm"}>
                <table className="table table-striped table-transaksi-iuran">
                    <thead>
                    <tr>
                        <th rowSpan={2}>Item Transaksi</th>
                        <th colSpan={12}>Bulan Tagihan</th>
                    </tr>
                    <tr>
                        <th>Jan</th>
                        <th>Feb</th>
                        <th>Mar</th>
                        <th>Apr</th>
                        <th>Mei</th>
                        <th>Jun</th>
                        <th>Jul</th>
                        <th>Ags</th>
                        <th>Sep</th>
                        <th>Okt</th>
                        <th>Nov</th>
                        <th>Des</th>
                    </tr>
                    </thead>
                    <tbody>
                    {itemIuran.map((item, i) => (
                        <tr key={i}>
                            <td>
                                <div className={"item"}>
                                    <div className="item-content">
                                        <div className="item-title">
                                            <label>{item.nama_item}</label>
                                        </div>
                                        <div className="item-qty">
                                            <small><span id={"qty"}>
                                                    {selectedValues[item.id]?.length || 0}
                                        </span>x</small>
                                        </div>
                                    </div>
                                    <div className="item-subtotal">
                                        <label
                                            id={"subtotal"}>{formatCurrency(item.nominal * (selectedValues[item.id]?.length || 0))}</label>
                                    </div>
                                </div>
                            </td>
                            {
                                tagihanRumah.map((data, index) =>  (
                                    <td className={"bulan-tagihan"} key={index}>
                                        <input type="checkbox"
                                               name={`tagihan_${item.id}[]`}
                                               value={data.id}
                                               onChange={(e) =>
                                                   handleCheckboxChange(item.id, data.id, e.target.checked)
                                               }
                                        />
                                    </td>
                                ))
                            }
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td style={{textAlign: "end"}}>{formatCurrency(total)}</td>
                        <td colSpan={12}><strong>TOTAL</strong></td>
                    </tr>
                    </tfoot>
                </table>
            </form>
            <button type={"submit"} form={"submitForm"}>{!loadingForm?'Bayar':'Loading'}</button>
        </MainPage>
    )
}