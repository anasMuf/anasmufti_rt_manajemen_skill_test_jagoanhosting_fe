import {Link, useLocation} from "react-router-dom";

export default function Menu() {
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === "/") {
            return location.pathname === "/" ? 'menu-item aktif' : 'menu-item';
        }
        return location.pathname.startsWith(path) ? 'menu-item aktif' : 'menu-item';
    };

    return (
        <div className="menu">
            <ul>
                <li className={isActive('/')}>
                    <Link to="/">Dashboard</Link>
                </li>
                <li className={isActive('/penghuni')}>
                    <Link to="/penghuni">Penghuni</Link>
                </li>
                <li className={isActive('/rumah')}>
                    <Link to="/rumah">Rumah</Link>
                </li>
                <li className={isActive('/item-transaksi')}>
                    <Link to="/item-transaksi">Item Transaksi</Link>
                </li>
                <li className={isActive('/transaksi/iuran')}>
                    <Link to="/transaksi/iuran">Transaksi Iuran</Link>
                </li>
                <li className={isActive('/transaksi/pengeluaran')}>
                    <Link to="/transaksi/pengeluaran">Transaksi Pengeluaran</Link>
                </li>
                <li className={isActive('/laporan')}>
                    <Link to="/laporan">Laporan</Link>
                </li>
            </ul>
        </div>
    );
}