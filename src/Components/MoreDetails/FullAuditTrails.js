import React , { Fragment,useEffect, useState } from 'react';
import { useHistory,useParams } from "react-router-dom";
import axios from 'axios';
import {getToken, getUrl} from "../../Utils/Common";
import "./MoreDetails.scss";

function FullAudittrails() {
    let history = useHistory();
    let params = useParams();
    const [fullAuditDetails, setFullAuditDetails] = useState([])

    const title = params.title;

    const path = window.location.href; 
    let nodeId =  path.split('/')
    let id = nodeId[5]
    console.log(nodeId)
    
    useEffect(() => {axios.get(getUrl()+
        `alfresco/s/ev/nodeaudittrail?nodeRef=workspace://SpacesStore/${id}`,
        {
            headers: {
              Authorization: `Basic ${btoa(getToken())}`,
           },
          }).then((response)=>{
              let MoreData=response.data;
              console.log(MoreData)

        setFullAuditDetails(MoreData.data.slice(0,20).map(d=>{
            return{
            timeF: d.time.split('T')[0],
            actionF: d.method,
            userF: d.userName.split('.')[0]
            }
        }))
    })}, [])

    return(
        <Fragment>
        <div className="audit-header">
        <h2>{title}</h2>
        <button onClick={() => history.goBack()}>Back</button>

            <h3>Detailed Document Audit History</h3>
           
                <table>
                <thead className="label-input">
                <tr>
                <th className="actions">Action </th>
                <th className="users">User</th>
                <th className="time">Time</th>
                </tr>
                
                {fullAuditDetails.map((d)=> (
                <tr key={d.id}>   
                <td >{d.actionF}</td>
                <td >{d.userF}</td>
                <td>{d.timeF}</td>
                </tr>))}
                </thead>
                </table>
        </div>
        </Fragment>
        )
}

export default FullAudittrails;