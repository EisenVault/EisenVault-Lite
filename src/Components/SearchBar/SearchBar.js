/******************************************
* File: SearchBar.js
* Desc: Takes a search keyword and suggest files, we can preview them.On enter it will redirect to another page which returns list of all document which matches with search keyword.
* @returns: list of searched documents.
* @author: Shrishti Raghav, 6 October 2020
********************************************/

import React,{ useState, useEffect} from "react";
import {useHistory } from 'react-router-dom';
import Axios from 'axios';
import OutsideClickHandler from 'react-outside-click-handler';
import "./styleSearchBar.scss";
import { getToken,getUrl } from '../../Utils/Common';

 const Search = () => {
  let history = useHistory();
  const [data ,setData] = useState([]);
    const [filtered ,setFilterd] = useState([]);
    const [result , setResult] = useState("");
    const [show , setShow] = useState(false);

      /**
   * Fetch data using search api.
   *
   * @return  list of search result.
   */
            const fetchData =  ()=> {
                    try{
                        Axios.get(getUrl()+`alfresco/s/slingshot/live-search-docs?t=${result}&limit=5`,
                         
                             {headers:{
                                Authorization: `Basic ${btoa(getToken())}`
                                }
                              }).then((response) => {
                                     setData(response.data.items);
                                      setFilterd(response.data.items);
                                      setShow(true)
                                   });
                    }catch(err){
                      setResult("")
                      setData([])
                       setShow(false)
                        throw new Error(err);
                    }
                     };
      
      /**
   * Handles click events outside the search result list.
   *
   * @param {text} event The type of event occurred.
   * @return  true or false state to show search result.
   */
      const  handleOutsideClick = (e) => {
        setShow(false)
      }

      /**
   *  call fetchData function and pass search word given in input as parameter of fetchData Function.
   *
   * @param {text} e The type of event occurred.
   * @return  call fetchData function and pass search word as parameter.
   */
      const onChange =(e)=> {
            setResult(e.target.value);
            if (result.length !== 0)
            {
              fetchData(result);
            }
            else if (result.length === 0){
              setData([])
              setShow(false)
            }
        }
      
      
  /**
   * Redirects to a SearchResult.js page.
   *
   * @param {text} event The type of event occurred.
   * @return  Redirects to a SearchResult.js page.
   */
      const onEnter = (event) => {
        if (event.key === "Enter")
        history.push(`/search/${result}`)
      }

      
  /**
   * Redirects to document preview page .
   *
   * @param {number} id The node Id of document.
   * @param {text} name The name of document.
   * @return  Redirects to a new page.
   */
        function handleDocument(id , name){
           history.push(`/document-details/${id}/${name}`)
        }

    return (
        <div className="searchBox-container">
        <input 
            className="searchBox"
            type="text"
            placeholder="Type here to search ..."
            value={result}
            onChange={onChange}
            onKeyUp={onEnter}
        />   
      
        {show ? <OutsideClickHandler onOutsideClick={handleOutsideClick}><div className="menu-container">
        {data.map((r,i)=> ( 
                
                <ul key={i}>
                <li onClick={() => handleDocument(
                      r.nodeRef.substring(24),
                      r.name)}
                      className="search-item">{r.name}</li>
                </ul>
              )
            )
        }
        </div></OutsideClickHandler>: null}
    </div>
    )  

 }
  
export default Search;
