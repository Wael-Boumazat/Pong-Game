import {useState,useEffect} from 'react'
import {ClipLoader} from "react-spinners"

const styling={
    display:"block",
    border:"1px solid #5bbce8",
}
export default function Loader({loading}){
return(
    <ClipLoader
    color={'#5bbce8'}
    className='loader'
    loading={loading}
    cssOverride={styling}
    size={100}
    aria-label='Loading spinner'
    />
)
}