import { useParams } from "react-router-dom";
import {useEffect, useState} from "react"
import ListBrand from "./product/ListBrand";
import ListProduct from "./product/ListProduct";

const SearchPage = () => {
    const param: any = useParams();
    console.log(param.name);

    useEffect(()=> {
        
    })
    
    return (
        <>
            okok
        </>
    )
}

export default SearchPage;