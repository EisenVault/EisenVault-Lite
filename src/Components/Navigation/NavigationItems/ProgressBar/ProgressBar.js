import React, { useState,useEffect } from "react";
import { getToken,getUrl } from "../../../../Utils/Common";
import Axios from 'axios';
// import { instance } from "../../../ApiUrl/endpointName.instatnce";

//To make the calculation from bytes to GB.
function bytesToSize(bytes, seperator = "") {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return 'n/a'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
  if (i === 0) return `${bytes}${seperator}${sizes[i]}`
  return `${(bytes / (1024 ** i)).toFixed(1)}${seperator}${sizes[i]}`
}

const ProgressBar = () => {
  const [data, getData] = useState([]);
  const [ loading, setLoading] = useState(true);
  
  //API call
  useEffect(() => {
    Axios.get(getUrl()+'/alfresco/s/aws-reposize',
    {headers:{
      Authorization: `Basic ${btoa(getToken())}`
    }
    })
    .then((response) =>{
    console.log(response.data)
    getData(response.data)
    setLoading(false) 
  }).catch((error) => {
    console.error(error)
  });
  }, []);

  //Storing the storage in GB.
  const freeSpace = bytesToSize(data.storeFreeSpace, " ")
  const usedSpace = bytesToSize(data.storageSpaceConsumed, " ")

  //Displaying the storage data.
  return (
    <div>
      
      { loading ? <h5> Free Space: {"Calculating.."} </h5>
      : <h5> Free Space: { freeSpace }</h5> }
      
      { loading ? <h5> Used Space: {"Calculating.."} </h5> : 
      <h5> Used Space: { usedSpace } </h5> }

    </div>
  );
};

export default ProgressBar;