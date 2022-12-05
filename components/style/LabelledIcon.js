import React, { Component } from "react";
import { Icon, } from "react-native-elements";
import { Text, View } from "react-native";
import styles from "./Style";

class LabelledIcon extends Component {

  constructor(props){
    super(props)
  }

  render() {
     console.log("LabelledIcon: render");
     return(

        <View style={this.props.style}>
           <Icon
              raised
              reverse
              name={this.props.name}
              type={this.props.type}
              color={this.props.color}
              size={30}
           />
           <Text style={{alignSelf:"center", color: this.props.color, marginLeft:10, fontSize:30, fontWeight:'bold'}}>
              {this.props.label}
           </Text>
        </View>
     );
  }
}

export default LabelledIcon;
