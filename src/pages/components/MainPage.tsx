interface MainPageProps {
    children?: React.ReactNode;
    menu: string
}

export default function MainPage({children, menu = "page-dashboard"}: MainPageProps) {
    return (
        <main className={`main ${menu}`}>
            <div className="content">
                {children}
            </div>
        </main>
    );
}