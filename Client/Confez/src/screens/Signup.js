import React,{Component} from 'react';
import {NativeModules,AppRegistry,StyleSheet,Text,View, Image, Dimensions, TouchableOpacity,ScrollView,Alert,CameraRoll} from 'react-native';
import {RkButton} from 'react-native-ui-kitten';
import ImagePicker from 'react-native-image-crop-picker';
import {socket} from '../utils/socket.js';
import RoundedText from '../components/RoundedText';
import StepIndicator from '../components/StepIndicator';
import * as R from '../R';
import {Drive} from '../utils/drive';
import Socket from '../utils/socket';


const isBlank=(str)=> {
  return (!str || /^\s*$/.test(str));
}
const isEmail=(str)=>{
  return (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(str))
}
export default class Signup extends Component {

  constructor(props){
    super(props);
    this.state ={
      name : 'Sriram Swain',
      reg_no : '15BCE1223',
      email : 'awesomesriram25@gmail.com',
      password : '12345',
      retype : '12345',
      username : "sriram0510",
      width : null,
      height : null,
      currentPage : 1,
      profile_image : Images.pro_pic,
      picAddText:'Tap to add profile picture',
      profilePicture :null
    }

    Socket.addChannel('signup_reply',(result)=>{
      console.log(result);
      if(result=='successful') this.props.navigation.goBack();
      else (Alert.alert('','Error'));
    });
  }

  static navigationOptions ={
    header : null
  };

  componentWillMount(){
    var window= Dimensions.get('window');
    this.setState({width:window.width,height:window.height});
  }

  signUp(photo_link){
    console.log(photo_link);
    Socket.send('signup',{
      email : this.state.email,
      password : this.state.password,
      reg_no : this.state.reg_no,
      username : this.state.username,
      name : this.state.name,
      photo_link : photo_link
    });
  }

  onSignUpPress=()=>{
    if(this.state.currentPage==1){
      if(isBlank(this.state.reg_no)||isBlank(this.state.name)){
        Alert.alert('','Incomplete Data !');
      }
      else if(!(/[0-9][0-9][A-Z][A-Z][A-Z][0-9][0-9][0-9][0-9]/.test(this.state.reg_no))){
        Alert.alert('','Invalid Registration Number !')
      }
      else{
        this.refs.form.scrollTo({x:this.state.width,y:0,animated:true});
        this.setState({currentPage:2});
      }
    }
    else if(this.state.currentPage==2){
      if(isBlank(this.state.email)||isBlank(this.state.username)) Alert.alert('','Incomplete Data !');
      else if(!isEmail(this.state.email)) Alert.alert('','Invalid Email');
      else{
        this.refs.form.scrollTo({x:this.state.width*2,y:0,animated:true});
        this.setState({currentPage:3});
      }
    }
    else if(this.state.currentPage==3){
      if(isBlank(this.state.password)||isBlank(this.state.retype)){
        Alert.alert('','Incomplete Data !');
      }
      else if(this.state.password!=this.state.retype){
        Alert.alert('',"Password Doesn't Match");
      }
      else{
        this.refs.form.scrollTo({x:this.state.width*3,y:0,animated:true});
        this.setState({currentPage:4});
      }
    }
    else{
      if(this.state.profilePicture!=null){
        Drive.uploadFile(this.state.profilePicture,(response)=>{
          console.log(response);
          this.signUp(response.id);
        });
      }
      else{
        this.signUp('null')
      }
    }
  }

  openPicker(){
      ImagePicker.openPicker({
        width: 200,
        height: 200,
        cropping: true,
        cropperCircleOverlay:true,
        mediaType:'photo'
      }).then(image => {
        this.setState({profile_image:{uri:image.path},picAddText:'',profilePicture:image});
      })
      .catch(error => this.setState({profile_image : Images.pro_pic,picAddText:'Tap to add profile picture',profilePicture:null}));
  }



  render(){
    const widthStyle = {width:this.state.width*0.85};
    const dynamicStyle =  StyleSheet.flatten([widthStyle,styles.inputView]);
    return(
      <ScrollView>
        <View style={[styles.container,{width : this.state.width}]}>
          <Image source={R.Images.logo} style={{width:100,height:100, marginTop:'10%'}}/>
          <Text style={styles.title}>Confez</Text>
          <StepIndicator current={this.state.currentPage} style={{marginTop:10}}/>

          <ScrollView
          ref='form'
          scrollEnabled={false}
          pagingEnabled={true}
          style={{marginBottom:20,marginTop:30}}
          horizontal={true}
          contentContainerStyle={{}}
          showsHorizontalScrollIndicator={false}>
            <View style={{width : this.state.width,alignItems:'center'}}>
            <RoundedText imgSource ={Images.username}
            placeholder='Name'
            style={dynamicStyle}
            inputTextStyle={styles.inputTextStyle}
            onChangeText={(name)=>{this.setState({name})}}
            imageStyle = {styles.image}/>

            <RoundedText imgSource ={Images.hat}
            placeholder='Registration No.'
            style={dynamicStyle}
            inputTextStyle={styles.inputTextStyle}
            onChangeText={(reg_no)=>{this.setState({reg_no})}}
            imageStyle = {styles.image}
            autoCapitalize="characters"/>
            </View>

            <View style={{width : this.state.width,alignItems:'center'}}>

            <RoundedText imgSource ={Images.mail}
            placeholder='Email'
            style={dynamicStyle}
            inputTextStyle={styles.inputTextStyle}
            onChangeText={(email)=>{this.setState({email})}}
            imageStyle = {styles.image}/>

            <RoundedText imgSource ={Images.login}
            placeholder='Username'
            style={dynamicStyle}
            inputTextStyle={styles.inputTextStyle}
            onChangeText={(username)=>{this.setState({username})}}
            imageStyle = {styles.image} />

            </View>

            <View style={{width : this.state.width,alignItems:'center'}}>
            <RoundedText imgSource = {Images.key}
            placeholder='Password' secureTextEntry={true}
            style={dynamicStyle} inputTextStyle={styles.inputTextStyle}
            onChangeText={(password)=>{this.setState({password})}}
            imageStyle = {styles.image}/>


            <RoundedText imgSource = {Images.unlocked}
            placeholder='Retype Password' secureTextEntry={true}
            style={dynamicStyle} inputTextStyle={styles.inputTextStyle}
            onChangeText={(retype)=>{this.setState({retype})}}
            imageStyle = {styles.image}/>

            </View>

            <View style={{width : this.state.width,alignItems:'center',justifyContent:'center'}}>
              <TouchableOpacity onPress={()=>this.openPicker()}>
              <View >
              </View>
                <View style={{borderRadius:100,borderWidth:1,borderColor:Colors.primary,justifyContent:'center',backgroundColor:'#000000BF',overflow:'hidden'}}>
                  <Image style={{width:130,height:130}} source={this.state.profile_image}/>
                  <Text style={[styles.addPicStyle,{color:'white'}]}>{this.state.picAddText}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <RkButton rkType='rounded' onPress={this.onSignUpPress}
            style={{backgroundColor:Colors.primary,width:this.state.width*0.75, marginVertical:20}}>
              {(this.state.currentPage<4?'Continue':'Signup')}
          </RkButton>

          <TouchableOpacity onPress={()=>this.props.navigation.goBack()} style={{marginBottom :'8%',padding:20}}>
            <View style={{flexDirection:'row'}}>
              <Text>Already have an account? </Text>
              <Text style={{fontWeight:'bold'}}> Login</Text>
            </View>
          </TouchableOpacity>
        </View>
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  addPicStyle: {
    position: 'absolute',
    alignSelf:'center',
    textAlign:'center',
    flex:1,

  },
  container:{
    flex:1,
    justifyContent:'center',
    alignItems :'center',
    backgroundColor:'white'
  },
  inputView:{
    margin:10,
    paddingHorizontal:10,
    paddingVertical : 6,
  },
  inputTextStyle:{
    fontSize:16,
    color:'black',
  },
  title :{
   fontSize : 35,
   fontFamily : 'IndieFlower',
   color : 'black'
  },
  image:{
    width : 25,
    height :25,
  },
});

AppRegistry.registerComponent('Signup',()=>Signup);
