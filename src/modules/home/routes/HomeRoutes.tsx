import { Navigate, Route, Routes } from "react-router-dom"
import { HomePage } from "../pages/HomePage"
import { ErrorPage } from "../pages/ErrorPage"
import { ProductPage } from "../../products/pages/ProductPage"
import { InputPage } from "../../movements/pages/InputPage"
import { OutputPage } from "../../outputs/pages/OutputPage"
import { ReportPage } from "../../reports/pages/ReportPage"

export const HomeRoutes = () => {

  return (
    <Routes>
        <Route path="/" element={ <HomePage /> } />
        <Route path="error" element={ <ErrorPage /> } />
        <Route path="products" element={ <ProductPage /> } />
        <Route path="inputs" element={ <InputPage /> } />
        <Route path="outputs" element={ <OutputPage /> } />
        <Route path="reports" element={ <ReportPage /> } />
        <Route path="/*" element={ <Navigate to="/logistic/error" /> } />
    </Routes>
  )

}
