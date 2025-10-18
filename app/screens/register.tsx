import React from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Checkbox } from "react-native-paper";
import {useFonts, Alegreya-Italic} from '@expo-google-fonts/alegreya';
const RegisterScreen = () =>{
    const[checked,setChecked]= React.useState(false);
    const [formData, setFormData]= React.useState({
        name:'',
        email:'',
        password:'',
        confirmPassword:''

    });
    const handleChange=(name, value)=>{
        setFormData({...formData,[name]:value});
    };

    const handleSubmit=()=>{

//Aqui pondremos la logica para el registro
        console.log(formData);
    };


return(
    <ScrollView contentContainerStyle={styles.container}>
    
    <Text style={styles.header}> A fun site for you</Text>

    <Text style={styles.header}> Crear una cuenta</Text>


     <View style={styles.formGroup}>
        <Text style={styles.label}>Nombre y Apellido</Text>
        <TextInput
        style={styles.input}
        value={formData.nombre}
        onChangeText={(text)=>handleChange('nombre',text)}/>
     </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Direccion de correo electronico</Text>
        <TextInput
        style={styles.input}
        value={formData.email}
        onChangeText={(text)=>handleChange('email',text)}
        keyboardType="email-address"
        autoCapitalize="none"/>
     </View>

      <View style={styles.formGroup}>
       <Text style={styles.label}>Contrasena</Text>
       <TextInput
       style={styles.input}
       value={formData.password}
       onChangeText={(text)=>handleChange('password',text)}
       secureTextEntry/>
      </View>

        <View style={styles.formGroup}>
         <Text style={styles.label}>Confirmar Contrasena</Text>
         <TextInput
         style={styles.input}
         value={formData.confirmPassword}
         onChangeText={(text)=>handleChange('confirmPassword',text)}
         secureTextEntry/>
        </View>
     <View style={styles.checkboxContainer}>
        <Checkbox
        status={checked ? 'checked': 'unchecked'}
        onPress={()=>setChecked(!checked)}
        color="#6200EE"/>
        <Text style={styles.checkboxLabel}>La contrasena debe tener al menos 6 caracteres</Text>
          
          
           <View style={styles.divider} />

        <TouchableOpacity style={styles.registerButton} onPress={handleSubmit}>
            <Text style={styles.registerButtonText}>CREAR CUENTA</Text>
        </TouchableOpacity>

        <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}> Ya eres miembro?</Text>
            <TouchableOpacity>
                <Text style={styles.loginLink}> Inicia sesion ahora</Text>
            </TouchableOpacity>
        </View>

     </View>
     </ScrollView>
 

);
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontFamily:'Alegreya-Italic',
    fontSize: 35,
  
    width:225,
    height:48,
    textAlign: 'center',
    marginVertical: 20,
    color: '#423646',

  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#423646',
  },
  formGroup: {
    marginBottom: 20,
    color: '#423646',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingLeft:16.80,
    paddingTop:13,
    paddingBottom:13,
    borderRadius: 50,
    fontSize: 16,
    width:380,
    position:'fixed',
    color: '#423646',
    backgroundColor: '#E2E2E2',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#423646',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  registerButton: {
    backgroundColor: '#6200EE',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    marginRight: 5,
    color: '#666',
  },
  loginLink: {
    color: '#6200EE',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;