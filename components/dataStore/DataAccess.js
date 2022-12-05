import React from "react";
import * as firebase from "firebase";

export async function saveDateOfLastCompletedTest(dateOfLastTest){
   var userId = firebase.auth().currentUser.uid;
   firebase.database().ref('profiles/'+userId+"/history/").set({
       dateOfLastTest
    }).then((data)=>{
       console.log('data ', data)
    }).catch((error)=>{
       console.log('error ', error)
    });
}

export async function getDateOfLastCompletedTest(){
  var dateOfLastTest = null;
  var user = firebase.auth().currentUser;
  console.log("profiles/"+user.uid);
  await firebase.database().ref('profiles/'+user.uid+'/history/')
    .once('value', (snapshot) => {
      if (snapshot.val() != null)
      {
         dateOfLastTest = snapshot.val().dateOfLastTest;
      }
      else
      {
         console.log("could not find user data");
      }
    })
    .catch((error)=>
    {
      console.log("could not find history data");
    });

 return dateOfLastTest;
}
