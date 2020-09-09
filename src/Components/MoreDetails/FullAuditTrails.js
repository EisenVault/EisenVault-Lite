import React , { Fragment,useRef,useEffect, useState } from 'react';
import { useHistory,useParams } from "react-router-dom";
import Axios from 'axios';
import {getToken, getUrl} from "../../Utils/Common";
// import { instance } from '../ApiUrl/endpointName.instatnce';
import "./MoreDetails.scss"
// useEffect(()=>{FullAudittrails()},[])

function FullAudittrails() {
    let history = useHistory();
    let params = useParams();
    const [fullAuditDetails, setFullAuditDetails] = useState([])

    const title = params.title;

    const path = window.location.href; 
    const id =  path.slice(32,68) 
    console.log(id)

    useEffect(() => {Axios.get(getUrl()+`/alfresco/s/ev/nodeaudittrail?nodeRef=workspace://SpacesStore/${id}`,
        {
            headers: {
              Authorization: `Basic ${btoa(getToken())}`,
           },
          }).then((response)=>{
              let MoreData=response.data;
              console.log(MoreData)

        setFullAuditDetails(MoreData.data.map(d=>{
            return{
            timeF: d.time.split('T')[0],
            actionF: d.method,
            userF: d.userName.split('.')[0]
            }
        }))
    })}, [])

    return(
        <Fragment>
        <div className="modal-header">
        <h2>{title}</h2>
        <button onClick={() => history.goBack()}>Back</button>
        </div>
        <div>
          <div>
            <h3>Detailed Document Audit History</h3>
           
                <table>
                <tbody className="label-input">
                <th className="actions">Action </th>
                <th className="users">User</th>
                <th className="time">Time</th>

                {fullAuditDetails.map((d)=> (
                <tr key={d.id}>   
                <td >{d.actionF}</td>
                <td >{d.userF}</td>
                <td>{d.timeF}</td>
                </tr>))}
                </tbody>
                </table>
          </div>
        </div>
        </Fragment>
        )
}

export default FullAudittrails;