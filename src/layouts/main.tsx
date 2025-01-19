import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './layout.css'
import Header from "./components/Header.tsx";
import Menu from "./components/Menu.tsx";
import Content from "./components/Content.tsx";
import Footer from "./components/Footer.tsx";
import {BrowserRouter} from "react-router-dom";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Header/>
            <Menu/>
            <Content/>
            <Footer/>
        </BrowserRouter>
    </StrictMode>,
)
