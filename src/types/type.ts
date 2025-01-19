export interface PenghuniProps {
    id: string;
    nama_lengkap: string;
    foto_ktp: string;
    gender: string;
    status_penghuni: string;
    sudah_menikah: boolean;
}

export interface RumahProps {
    id: string;
    no_rumah: string;
    foto_rumah: string;
    status_penghuni: string;
}
export interface PenghuniRumahProps {
    id: string;
    penghuni: PenghuniProps;
    rumah: RumahProps;
    is_aktif: boolean;
}

export interface ItemTransaksiProps {
    id: string;
    nama_item: string;
    tipe: string;
    wajib: boolean;
    nominal: number;
}

export interface TagihanRumahProps {
    id: string;
    no_rumah: string;
    foto_rumah: string;
    status_penghuni: string;
    tagihan: TagihanProps
}

export interface  TagihanProps {
    id: string;
    rumah_id: string;
    bulan: string;
    tahun: string;
    terbayar: boolean;
}

export  interface TransaksiProps{
    id: string;
    tipe: string;
    deskripsi: string;
    tgl_transaksi: string;
    debit: number;
    kredit: number;
    transaksi_detail: TransaksiDetailProps
}

export interface TransaksiDetailProps{
    id: string;
    transaksi: TransaksiProps;
    item_transaksi: ItemTransaksiProps;
    item_transaksi_id: string;
    item_transaksi_nominal: number
}