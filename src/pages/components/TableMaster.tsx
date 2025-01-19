import {Link} from "react-router-dom";
import "../components/css/table.css";

interface TableMasterProps {
    title: string;
    basePath: string;
    columns: React.ReactNode;
    datas: React.ReactNode[];
    aksi: boolean
}

export default function TableMaster({title, basePath, columns, datas, aksi=true}: TableMasterProps) {
    return (
        <>
            <div className="content-header">
                <div className="title">
                    <h3>Data {title}</h3>
                </div>
                {aksi ?
                    <div className="aksi">
                        <Link to={{
                            pathname: `/${basePath}/form`,
                        }}>Tambah</Link>
                    </div>
                    : ''}
            </div>
            <table className="table table-striped">
                <thead>
                {columns}
                </thead>
                <tbody>
                {datas}
                </tbody>
            </table>
        </>
    );
}