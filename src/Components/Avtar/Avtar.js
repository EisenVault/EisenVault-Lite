import React, {useState , useEffect} from 'react';
import Avatar from "react-avatar";
import { getUser } from "../../Utils/Common";

/******************************************
* File: Avtar.js
* Desc: Create Avtar for the user with the initials of username.
* @returns: Avtar Icon.
* @author: Shayane Basu, 06 October 2020
********************************************/

const ProfilePic = () => {
    const [profileInitials, setProfileInitials] = useState(null);

    //get the username from localStorage and take the first character of the name.
    useEffect(() => {
        setProfileInitials (getUser() ? getUser().charAt(0) : "");
    }, [])

    return( 
        <Avatar className='avtarStyle'
        color='#E07050' size='3rem'
        round 
        maxInitials= {2}
        name= { profileInitials } 
        title= { getUser() }
        /> 
    )
}

export default ProfilePic;